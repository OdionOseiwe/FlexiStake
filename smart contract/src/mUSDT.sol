import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract mUSDT is ERC20("mUSDT", "USDT"){
    function mint() public {
        _mint(msg.sender, 10 * 1e18);
    }
}


    // --constructor-args "ForgeUSD" "FUSD" 18 1000000000000000000000