import Tether from '../images/tether.svg'

export default function Stats() {
  return (
    <div>
      <div
            className=" md:p-3 p-2 rounded-2xl mt-8  shadow-lg  w-60
        hover:-translate-y-2 
      transition-all duration-500"
          >
            <h1 className="mb-4">FlexiStake Stats</h1>
            <div className=" rounded-2xl p-3 ">
              <div className="flex items-center">
                <div className="mr-4">
                  <img
                    src={Tether}
                    alt="logo "
                    className="size-8 rounded-full"
                  />
                </div>
                <div>
                  <p className="text-xs">TVL</p>
                  <p className="text-l">
                    $ <span>1.8</span> B
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            className=" md:p-3 p-2 rounded-2xl mt-8 shadow-lg
        hover:-translate-y-2 
      transition-all duration-500"
          >
            <h1 className="mb-4">Assets Restaked</h1>
            <div className="rounded-2xl p-3 ">
              <div className="flex items-center">
                <div className="mr-4">
                  <img
                    src={Tether}
                    alt="logo "
                    className="size-8 rounded-full"
                  />
                </div>
                <div>
                  <p className="text-xs">mUSDT</p>
                  <p className="text-l">
                    $ <span>1.8</span> B
                  </p>
                </div>
              </div>
            </div>
          </div>
    </div>
  )
}

