// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuardTransient.sol";

contract Staking is Ownable, ReentrancyGuardTransient{
    using SafeERC20 for IERC20;
    IERC20 rewardToken;

    uint256 public basicAPR = 1000; // 10.00% (10000 = 100%)
    uint256 private SCALING_FACTOR = 10000; // used to reduce APR when total staked grows
    uint256 public totalStaked;
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


    // --- set APR in BPS (e.g., pass 1000 for 10.00%) ---
    function setAPR(uint256 _aprBps) external onlyOwner {
        require(_aprBps <= 10000, "APR can't exceed 100%");
        basicAPR = _aprBps;
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
    function claimRewards(LockupTier _lockupTier) public nonReentrant {
        // collect freshly-calculated pending + stored Rewards
        uint256 pending = calculateRewards(msg.sender, _lockupTier);
        uint256 stored = Rewards[msg.sender][_lockupTier];
        uint256 totalPending = pending + stored;
        require(totalPending > 0, "No rewards");
        require(rewardToken.balanceOf(address(this)) >= totalPending, "Insufficient reward tokens");

        Rewards[msg.sender][_lockupTier] = 0;
        stakes[msg.sender][_lockupTier].lastUpdateTime = block.timestamp;

        totalRewardsPaid += totalPending;
        rewardToken.safeTransfer(msg.sender, totalPending);
        emit ClaimedReward(msg.sender, totalPending);
    }
    

    function _getLockupDuration(LockupTier _tier) internal pure returns (uint256) {
        if (_tier == LockupTier.TIER_30_DAYS) return 30 days;
        if (_tier == LockupTier.TIER_90_DAYS) return 90 days;
        return 365 days;
    }

    function updateRewards(address _owner, LockupTier _lockupTier) internal {
        uint256 pending = calculateRewards(_owner, _lockupTier);
        if (pending > 0) {
            Rewards[_owner][_lockupTier] += pending;
        }
        // reset lastUpdateTime so we don't double count next time
        stakes[_owner][_lockupTier].lastUpdateTime = block.timestamp;
    }

    function calculateRewards(address _owner, LockupTier _lockupTier) internal view returns (uint256) {
        Stake storage userStake = stakes[_owner][_lockupTier];
        uint256 stakedAmount = userStake.stakeAmount;
        if (stakedAmount == 0) return 0;

        uint256 stakingDuration = block.timestamp - userStake.lastUpdateTime;
        uint256 lockUp = _getLockupDuration(_lockupTier);
        if (stakingDuration > lockUp) stakingDuration = lockUp;

        // tier multiplier in integer percent * 100 (100 => 1.0x)
        uint256 tierMultiplierPercent;
        if (_lockupTier == LockupTier.TIER_30_DAYS) tierMultiplierPercent = 100;      // 1.0x
        else if (_lockupTier == LockupTier.TIER_90_DAYS) tierMultiplierPercent = 120; // 1.2x
        else tierMultiplierPercent = 150; // 1.5x

        uint256 aprBps = currentAPR(totalStaked); // in BPS, e.g., 1000 = 10.00%
        // rewardPerYear in token units
        uint256 rewardPerYear = (stakedAmount * aprBps) / 10000;
        uint256 rewardForDuration = (rewardPerYear * stakingDuration) / 365 days;

        // apply tier multiplier
        return (rewardForDuration * tierMultiplierPercent) / 100;
    }

      

    // this is where the dynamic apr is calculated base on the totalStaked
    // what determines the APR is totalStaked
    // the more staked, the lower the APR
    function currentAPR(uint256 _totalStaked) internal view returns (uint256) {
        // Reduce APR as total staked increases:
        // apr = basicAPR * SCALING_FACTOR / (SCALING_FACTOR + totalStakedInTokens)
        // where totalStakedInTokens = totalStaked / 1e18 (so it's plain token units)
        uint256 totalInTokens = _totalStaked / 1e18;
        uint256 denom = SCALING_FACTOR + totalInTokens; 
        return (basicAPR * SCALING_FACTOR) / denom; // result in BPS
    }

    function getUserStake(address user, LockupTier tier) public view returns (uint256 amount, uint256 lastUpdate) {
        return (stakes[user][tier].stakeAmount, stakes[user][tier].lastUpdateTime);
    }

    function getPendingRewards(address user, LockupTier tier) public view returns (uint256) {
        return calculateRewards(user, tier) + Rewards[user][tier];
    }
}