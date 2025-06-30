# Overview

FlexiStake is a flexible staking contract that allows users to stake ERC20 tokens and earn rewards based on different lockup periods. The contract offers three staking tiers with varying reward multipliers and includes features for secure withdrawals, emergency exits, and reward calculation

## Key Features
### Three Staking Tiers:

 - 30-day lockup (1x multiplier)

 - 90-day lockup (1.5x multiplier)

 - 365-day lockup (3x multiplier)

### Dynamic APR Calculation:

 - Base APR starts at 10%

 - APR adjusts based on total staked amount

### Secure Operations:

- Reentrancy protection

- Penalty for early withdrawals (5%)

- Proper access control (Ownable)

## Contract Functions
### User Functions
- stakeToken(amount, tier) - Stake tokens in a selected tier

- withdraw(amount, tier) - Withdraw staked tokens after lockup period

- emergencyWithdraw(amount, tier) - Withdraw early with penalty

- claimRewards(tier) - Claim accumulated rewards

### View Functions
- getUserStake(user, tier) - View user's stake details

- getPendingRewards(user, tier) - Check pending rewards

- currentAPR(totalStaked) - View current APR based on total staked

### Admin Functions
- setAPR(newAPR) - Owner can update base APR

## Usage
- Deploy contract with reward token address

- Users approve token spending before staking

- Stake tokens in preferred tier

- Withdraw or claim rewards after lockup period

