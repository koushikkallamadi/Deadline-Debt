export function calcDebt(item) {
  const now = Date.now();
  const due = new Date(item.dueDate).getTime();
  const pending = item.topics.length - item.completedTopics.length;
  const ratio = item.topics.length
    ? item.completedTopics.length / item.topics.length
    : 0;

  // All topics done → no debt
  if (ratio === 1) return 0;

  let debt = pending * 3;
  if (now > due) {
    const daysLate = Math.floor((now - due) / 86400000);
    debt += daysLate * 15;
  }
  const daysLeft = (due - now) / 86400000;
  if (daysLeft > 7) debt = Math.max(0, debt - 20);

  // Scale debt down proportionally to completion
  return Math.round(debt * (1 - ratio));
}
