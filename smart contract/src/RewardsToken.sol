import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20("Rewards", "RWD"){
    function mint() public {
        _mint(msg.sender, 10 * 1e18);
    }
}