  import cron from "cron";
  import https from "https";

  const job = new cron.CronJob("*/14 * * * *", function () {
    https
      .get(process.env.API_URL, (res) => {
        if (res.statusCode === 200) console.log("Get Request Sent Successfully!");
        else console.log("Get request failed", res.statusCode);
      })
      .on("error", (e) => console.log("Error While sending request", e));
  });

  export default job;

  //CRON job explanation
  // Cron job are scheduled tasks that run priodically at fiexed intervals
  // we want to send 1 GET request for every 14 minutes

  // How Define a "Schedules" ?
  // You define a schedule using a cron expression, which consists of 5 fields representing;

  // ! MINUTE, HOUR , DAY OF THE MONTH, MONTH, DAY OF THE WEEK

  // ? EXAMPLES && EXPLANATION
  // * 14 * * * * - every 14 minutes
  // * 0 0 * * 0  - At midnight on every sunday
  // * 30 3 15 * *- At 3:30 AM, on the 15th of every month
  // * 0 0 1 1 *  - At Midnight, on january 1st
  // * 0 * * * *  - every hour