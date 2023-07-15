function updateClock() {
  const currentTime = new Date();
  // Operating System Clock Hours for 24h clock
  const currentHours = currentTime.getHours();
  // Operating System Clock Minutes
  let currentMinutes = currentTime.getMinutes();
  // Operating System Clock Seconds
  let currentSeconds = currentTime.getSeconds();
  // Adding 0 if Minutes & Seconds is More or Less than 10
  currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
  currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;

  const currentTimeString =
    currentHours + ":" + currentMinutes + ":" + currentSeconds + "";
  // print clock js in div #clock.
  $("#clock").html(currentTimeString);
}
$(document).ready(function () {
  setInterval(updateClock, 1000);
});
