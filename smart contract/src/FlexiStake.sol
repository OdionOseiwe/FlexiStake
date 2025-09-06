// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuardTransient.sol";

contract Staking is Ownable, ReentrancyGuardTransient{
    using SafeERC20 for IERC20;
    IERC20 rewardToken;

    uint256 public basicAPR = 10e18; // 10%
    uint256 public totalStaked;
    uint256 private SCALING_FACTOR = 10000; // 100%
    uint256 private totalRewardsPaid;
    uint256 private penaltyPercentage = 500;  // 5%

    enum LockupTier { 
        TIER_30_DAYS, 
        TIER_90_DAYS, 
        TIER_365_DAYS 
    }

    struct  Stake{
        uint256 lastUpdateTime;
        uint256 stakeAmount; 
    }

    mapping(address => mapping(LockupTier => Stake)) stakes;
    mapping(address => mapping(LockupTier => uint256)) Rewards;

    event Staked(address owner, uint256 amount);
    event Withdraw(address owner, uint256 amount);
    event EmergencyWithdraw(address owner, uint256 amount);
    event ClaimedReward(address owner, uint256 rewards);


    constructor(address _owner, address _rewardToken) Ownable(_owner){
        rewardToken = IERC20(_rewardToken);
    }

    function stakeToken(uint256 _amount, LockupTier _lockupTier) public nonReentrant{
        Stake storage userStake = stakes[msg.sender][_lockupTier];
        require(_amount > 0, "Invalid Amount");
        uint256 _previousStake = userStake.stakeAmount;

        if(_previousStake > 0){
            updateRewards( msg.sender,_lockupTier);
        }
   
        totalStaked += _amount;
        userStake.stakeAmount += _amount;
        userStake.lastUpdateTime = block.timestamp;
        basicAPR = currentAPR(totalStaked);
        rewardToken.safeTransferFrom(msg.sender, address(this), _amount);
        emit Staked(msg.sender, _amount);
    }

    function withdraw(uint256 _amount, LockupTier _lockupTier) public nonReentrant {
        Stake storage userStake = stakes[msg.sender][_lockupTier];
        require(userStake.stakeAmount >= _amount, "Insufficient staked amount");

        updateRewards(msg.sender, _lockupTier);

        uint256 lockUp = _getLockupDuration(_lockupTier);
        uint256 stakingDuration = block.timestamp - userStake.lastUpdateTime;

        uint256 amountToTransfer = _amount;

        // Apply 5% penalty if withdrawing before the tier ends
        if (stakingDuration < lockUp) {
            uint256 penalty = (_amount * 500) / 10000; // 5% penalty
            amountToTransfer = _amount - penalty;
        }

        totalStaked -= _amount;
        userStake.stakeAmount -= _amount;
        userStake.lastUpdateTime = block.timestamp;

        rewardToken.safeTransfer(msg.sender, amountToTransfer);

        emit Withdraw(msg.sender, amountToTransfer);
    }


    // automatically stake rewards again
    function claimRewards(LockupTier _lockupTier) public nonReentrant{
        uint256 pendingRewards = calculateRewards(msg.sender,_lockupTier);
        require(Rewards[msg.sender][_lockupTier] > 0, "No rewards");
        require(rewardToken.balanceOf(address(this)) >= pendingRewards, "Insufficient reward tokens");

        totalRewardsPaid += pendingRewards;
        Rewards[msg.sender][_lockupTier] = 0;
        stakes[msg.sender][_lockupTier].lastUpdateTime = block.timestamp;

        rewardToken.safeTransfer(msg.sender, pendingRewards);
        emit ClaimedReward(msg.sender, pendingRewards);
    }

    function setAPR(uint256 _apr) external onlyOwner {
        require(_apr > 0, "APR must be > 0");
        basicAPR = _apr * 100; // basic points
    }

    function _getLockupDuration(LockupTier _tier) internal pure returns (uint256) {
        if (_tier == LockupTier.TIER_30_DAYS) return 30 days;
        if (_tier == LockupTier.TIER_90_DAYS) return 90 days;
        return 365 days;
    }

    function updateRewards(address _owner, LockupTier _lockupTier) internal  {
        uint256 pending = calculateRewards(_owner, _lockupTier);
        Rewards[_owner][_lockupTier]+= pending;  
    }

    function calculateRewards(address _owner, LockupTier _lockupTier) internal view returns (uint256) {
        Stake storage userStake = stakes[_owner][_lockupTier];
        uint256 stakedAmount = userStake.stakeAmount;
        if (stakedAmount == 0) return 0;

        uint256 stakingDuration = block.timestamp - userStake.lastUpdateTime;
        uint256 lockUp = _getLockupDuration(_lockupTier);

        if (stakingDuration > lockUp) {
            stakingDuration = lockUp;
        }

        uint256 tierMultiplier;
        if (_lockupTier == LockupTier.TIER_30_DAYS) tierMultiplier = 1e18;      // 1.0
        else if (_lockupTier == LockupTier.TIER_90_DAYS) tierMultiplier = 15e17; // 1.5
        else tierMultiplier = 3e18; // 3.0

        uint256 apr = currentAPR(totalStaked); // apr = 5e16 
        uint256 rewardPerYear = (stakedAmount * apr) / 1e18;//(100e18 * 5e16) / 1e18
        uint256 rewardForDuration = (rewardPerYear * stakingDuration) / 365 days;//(5e18 * 30) /365

        return (rewardForDuration * tierMultiplier) / 1e18; //(4.1e17 * 1e18)/ 1e18 = 4.1e17
    }

    // this is where the dynamic apr is calculated base on the totalStaked
    function currentAPR(uint256 _totalStaked) public view returns (uint256) {
        // if basicAPR = 10e18 => 10%
        // totalStaked = 10e18
        // then numerator = 10e18 * 10000 = 1e21.
        // then denominator = 10010
        // 1e21 / 10010 = 9.999e16
        uint256 numerator = basicAPR * SCALING_FACTOR; 
        uint256 denominator = SCALING_FACTOR + (_totalStaked / 1e18);
        require(denominator != 0, "Math error");
        return numerator / denominator;
    }

    function getUserStake(address user, LockupTier tier) public view returns (uint256 amount, uint256 lastUpdate) {
        return (stakes[user][tier].stakeAmount, stakes[user][tier].lastUpdateTime);
    }

    function getPendingRewards(address user, LockupTier tier) public view returns (uint256) {
        return calculateRewards(user, tier) + Rewards[user][tier];
    }
}