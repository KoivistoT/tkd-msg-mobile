export default createTask = (taskType, data, taskId = null) => [
  {
    taskType,
    data,
    taskId,
  },
];
