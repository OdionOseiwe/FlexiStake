import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract mUSDT is ERC20("mUSDT", "USDT"){
    function mint() public {
        _mint(msg.sender, 1000 * 1e18);
    }
}

