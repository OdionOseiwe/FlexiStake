export function convertEpochToDays(stakeDate: number, tier:number, reward:number) {
    const targetDate = new Date(stakeDate * 1000);
    const now = new Date();

    const diffMs = now.getTime() - targetDate.getTime();
    if(reward > 0){
        if(tier === 0){
            return 30 - (Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        }else if(tier === 1){
            return 90 - (Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        }else{
            return 365 - (Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        } 
    }else{
        return 0;
    }
     
}

