const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const File = require("../models/file");
const User = require("../models/User");
const notifyAdmin = require("../utils/notifyAdmin");

const REPORT_DIR = path.join(__dirname, "..", "reports");
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR);

/* ================= DAILY ================= */
cron.schedule("0 0 * * *", async () => {
  await generateReport("daily");
});

/* ================= WEEKLY ================= */
cron.schedule("0 0 * * 0", async () => {
  await generateReport("weekly");
});

/* ================= MONTHLY ================= */
cron.schedule("0 0 1 * *", async () => {
  await generateReport("monthly");
});

async function generateReport(type) {
  const users = await User.countDocuments();
  const files = await File.countDocuments();

  const storageAgg = await File.aggregate([
    { $group: { _id: null, totalSize: { $sum: "$size" } } },
  ]);

  const storage = storageAgg[0]?.totalSize || 0;

  let csv = "Metric,Value\n";
  csv += `Users,${users}\n`;
  csv += `Files,${files}\n`;
  csv += `Storage(bytes),${storage}\n`;

  const filename = `${type}-report-${Date.now()}.csv`;
  fs.writeFileSync(path.join(REPORT_DIR, filename), csv);

  await notifyAdmin(
    `${type.toUpperCase()} admin report generated`,
    "success"
  );
}
