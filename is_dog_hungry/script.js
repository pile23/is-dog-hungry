// sadrzaj:
// #zamisao




$(document).ready(function () {
  console.log('Page ready');
  $('button').click(async function () {
    // send fetch, info that dog ate
    let url = "http://localhost:3202/kuca-hranjena/jeste";
    // let url = "http://192.168.1.154:3202/kuca-hranjena/jeste";
    let fetched = await fetch(url);
    location.reload();
  }

  );
});






