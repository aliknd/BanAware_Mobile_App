import client from "./client";

const endpoint = "/feedbacks";

const getFeedbacks = () => client.get(endpoint);

export const addFeedback = (feedback, onUploadProgress) => {
  // Extract the labels from the array
  const labels = feedback.category.map((item) => item.label);

  // Join the labels into a single string with " and " as a separator
  const labelsString = labels.join(" and ");
  //console.log(labelsString);
  const data = new FormData();
  data.append("categoryLabel", labelsString);
  data.append("categoryId", feedback.category.value);
  data.append("cuserId", feedback.cuser);
  data.append("description", feedback.description);
  return client.post(endpoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

export default {
  getFeedbacks,
  addFeedback,
};
