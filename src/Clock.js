export default function Clock({ end }) {
  let remaining = (end.getTime() - Date.now()) / 1000;
  let hh = "00",
    mm = "00",
    ss = "00";
  if (remaining > 0) {
    const h = Math.floor(remaining / 3600);
    remaining -= h * 3600;
    hh = "0" + h;
    const m = Math.floor(remaining / 60);
    remaining -= m * 60;
    mm = m + "";
    if (mm.length === 1) mm = "0" + mm;
    const s = Math.floor(remaining);
    ss = s + "";
    if (ss.length === 1) ss = "0" + ss;
  }
  return (
    <div className="Clock">
      {hh}:{mm}:{ss}
    </div>
  );
}
