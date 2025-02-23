const url = $persistentStore.read("url");

$httpClient.get(url, function(error, response, data) {
  if (error) {
    console.log(error);
    $done();
    return;
  }

  const result = JSON.parse(data);
  const bwLimit = result.monthly_bw_limit_b; // 每月流量限制（字节）
  const bwUsed = result.bw_counter_b;       // 已用流量（字节）
  const bwResetDay = result.bw_reset_day_of_month; // 流量重置日

  const now = new Date();
  const currentMonth = now.getMonth(); // 当前月份 (0-11)
  const currentDay = now.getDate();    // 当前日期

  // 计算下一个重置月份。
  let nextResetMonth = currentMonth + 1; // 先假设是下个月
  if(currentDay < bwResetDay){
    //如果今天还没到重置日，那么还在当月
    //nextResetMonth = currentMonth + 1; //已经在上面处理了，这里什么也不用做。  这条是旧逻辑
  }
  else{
      //如果已经过了重置日，那么重置月是下个月。
      nextResetMonth = currentMonth + 2;
  }
    
  //处理月份超过12的情况。
  nextResetMonth = nextResetMonth % 12;
  //如果nextResetMonth是0，那么代表是12月.
  if(nextResetMonth === 0)
  {
    nextResetMonth = 12;
  }


  const usedGB = (bwUsed / 1000000000).toFixed(3);
  const remainingGB = ((bwLimit - bwUsed) / 1000000000).toFixed(3);

  const panel = {
    title: "✈️ 𝙅𝙈𝙎 𝙄𝙣𝙛𝙤",
    content: `已用流量：${usedGB}GB\n剩余流量：${remainingGB}GB\n重置日期：${nextResetMonth}月${bwResetDay}号`,
    icon: 'airplane.circle.fill',
    'icon-color': '#000000',
  };

  $done(panel);
});
