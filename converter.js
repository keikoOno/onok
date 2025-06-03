(async()=>{
  const p = new URL(location).searchParams;
  const m = await (await fetch("https://raw.githubusercontent.com/keikoOno/onok/main/stationMap.json")).json();
  const r = await (await fetch("https://raw.githubusercontent.com/keikoOno/onok/main/lineMap.json")).json();
  const s = (p.get("station_ids")||"").split(",").map(i=>m[i]).filter(Boolean);
  const n = [...new Set((p.get("line_ids")||"").split(",").map(i=>r[i]).filter(Boolean))];
  if (!s.length) return "ERROR_NO_STATION";
  let u = "https://suumo.jp/jj/bukken/ichiran/JJ010FJ001/?ar=030&bs=011&jspIdFlg=patternEki&" +
          n.map(x => "rn=" + x).join("&") + "&" +
          s.map(x => "rnek=" + x).join("&");

  const min = parseInt(p.get("price_min"));
  if (!isNaN(min)) {
    const steps = [500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6000,6500,7000,7500,8000,9000,10000];
    const km = Math.ceil(min/1e4);
    u += "&kb=" + (steps.find(x => km <= x) || 10000);
  } else {
    u += "&kb=1";
  }

  const max = parseInt(p.get("price_max"));
  if (!isNaN(max)) {
    const steps = [500,1000,1500,2000,2500,3000,3500,4000,4500,5000,5500,6000,6500,7000,7500,8000,9000,10000,12000];
    let km = Math.ceil(max/1e4);
    if (max % 1e4 === 0) km -= 1;
    u += "&kt=" + (steps.find(x => km <= x) || 9999999);
  }

  const walk = parseInt(p.get("minutes_on_foot_max"));
  if (!isNaN(walk)) {
    const steps = [1,3,5,7,10,15,20];
    u += "&et=" + (steps.find(x => walk <= x) || 9999999);
  }

  if (p.get("house_review_tag_ids") === "1788") u += "&st=292";

  return u;
})();
