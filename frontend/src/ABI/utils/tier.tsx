export  const GetTierNumber = (tier:string):number =>{
      let tierNumber = tier.split('');
      return Number(tierNumber.slice(4)) - 1;
}