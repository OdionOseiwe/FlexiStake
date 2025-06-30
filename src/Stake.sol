// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuardTransient.sol";

contract Staking is Ownable, ReentrancyGuardTransient{
    using SafeERC20 for IERC20;
    IERC20 rewardToken;

    uint256 private basicAPR = 1000; // 10%
    uint256 public totalStaked = 800000000000000000000;
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

        rewardToken.safeTransferFrom(msg.sender, address(this), _amount);
        emit Staked(msg.sender, _amount);
    }

    function withdraw(uint256 _amount, LockupTier _lockupTier) public nonReentrant{
        Stake storage userStake = stakes[msg.sender][_lockupTier];
        require(userStake.stakeAmount >= _amount, "cant withdraw");

        uint256 _lastUpdateTime = userStake.lastUpdateTime;
        updateRewards(msg.sender,_lockupTier);

        uint256 lockUp = _getLockupDuration(_lockupTier);
        require(block.timestamp - _lastUpdateTime >= lockUp, "early Withdrawal");

        totalStaked-= _amount;
        userStake.lastUpdateTime = block.timestamp;
        userStake.stakeAmount -= _amount;

        rewardToken.safeTransfer(msg.sender, _amount);

        emit Withdraw(msg.sender, _amount);
    }

    function emergencyWithdraw(uint256 _amount, LockupTier _lockupTier) public nonReentrant {
        Stake storage userStake = stakes[msg.sender][_lockupTier];
        require(userStake.stakeAmount >= _amount, "cant withdraw");

        uint256 lockUp = _getLockupDuration(_lockupTier);
        require(block.timestamp - userStake.lastUpdateTime < lockUp, "This is not an early withdrawal");

        uint256 penaltyAmount = (_amount * penaltyPercentage) / 10000;
        totalStaked-= _amount;
        userStake.lastUpdateTime = block.timestamp;
        userStake.stakeAmount -= _amount;

        rewardToken.safeTransfer(msg.sender, (_amount - penaltyAmount));

        emit EmergencyWithdraw(msg.sender, _amount);
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

    function _getLockupDuration(LockupTier _tier) private pure returns (uint256) {
        if (_tier == LockupTier.TIER_30_DAYS) return 30 days;
        if (_tier == LockupTier.TIER_90_DAYS) return 90 days;
        return 365 days;
    }

    function updateRewards(address _owner, LockupTier _lockupTier) internal  {
        uint256 pending = calculateRewards(_owner, _lockupTier);
        Rewards[_owner][_lockupTier]+= pending;  
    }

    function calculateRewards(address _owner, LockupTier _lockupTier) public view  returns(uint256) {
        uint256 stakingDuration = block.timestamp - stakes[_owner][_lockupTier].lastUpdateTime;
        uint256 stakedAmount = stakes[_owner][_lockupTier].stakeAmount;
        if (stakedAmount == 0) return 0;

        uint256 tierMultiplier;
        if (_lockupTier == LockupTier.TIER_30_DAYS) tierMultiplier = 1000;      // 1x
        else if (_lockupTier == LockupTier.TIER_90_DAYS) tierMultiplier = 1500; // 1.5x
        else tierMultiplier = 3000; // 3x

        uint256 apr = currentAPR(totalStaked);
        uint256 rewardPerYear = (stakedAmount * apr) / 1e18;
        uint256 rewardForDuration = (rewardPerYear * stakingDuration) / 365 days;
    
        return (rewardForDuration * tierMultiplier) / 100000;
    }

    function currentAPR(uint256 _totalStaked) public view returns (uint256) {
        uint256 numerator = basicAPR * SCALING_FACTOR * 1e18; // Scale up numerator first
        uint256 denominator = SCALING_FACTOR + (_totalStaked / 1e14);
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