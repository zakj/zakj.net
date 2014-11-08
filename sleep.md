---
title: Sleep!
layout: base
permalink: /sleep/
---

<div>
  <h1>Wake up at:</h1>

  <ul id="results">
    <li></li>
    <li></li>
    <li></li>
  </ul>
</div>


<style>
  body {
    background: black;
    color: #222;
    text-align: center;

    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: column;
    flex-direction: column;
    -webkit-justify-content: space-around;
    justify-content: space-around;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    padding-bottom: 100px;
  }
  li {
    background: #222;
    border-radius: 3px;
    color: #000;
    display: inline-block;
    padding: 5px 10px;
  }
</style>

<script>
  (function () {
    var ONE_MINUTE = 1000 * 60,
        FALL_ASLEEP_TIME = 14 * ONE_MINUTE,
        SLEEP_CYCLE_TIME = 90 * ONE_MINUTE,
        results = document.getElementById('results');

    function formatTime(date) {
      var hours = date.getHours(),
          minutes = date.getMinutes();
      return hours + ":" + (minutes < 10 ? "0" + minutes : minutes);
    }

    function wakeupTimes(bedtime) {
      bedtime = +bedtime + FALL_ASLEEP_TIME;
      return [0, 0, 0].map(function(_, i){
        return new Date(bedtime + SLEEP_CYCLE_TIME * (i + 4));
      });
    }

    function updateWakeupTimes(times) {
      var timeNodes = results.children;
      for (var i = 0; i < times.length; ++i) {
        timeNodes[i].textContent = formatTime(times[i]);
      }
    }

    function tick() {
      updateWakeupTimes(wakeupTimes(new Date));
    }

    document.addEventListener('touchstart', tick);
    tick();
  }());
</script>
