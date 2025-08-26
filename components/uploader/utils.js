export const getCredentials = async (lessonId, courseId) => {
  const response = await fetch("/api/vdocipher", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ lessonId, courseId }),
  });
  const data = await response.json();

  if (!data.clientPayload) {
    return {
      error: true,
      message: "Credential Error",
    };
  }
  return data;
};

export const uploadFile = (file, uploadCreds, handleUploadProgress) => {
  if (!file || !uploadCreds) {
    return Promise.resolve({
      status: "error",
      message: "Missing file or credentials",
    });
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("key", uploadCreds.key);
    formData.append("policy", uploadCreds.policy);
    formData.append("x-amz-signature", uploadCreds["x-amz-signature"]);
    formData.append("x-amz-algorithm", uploadCreds["x-amz-algorithm"]);
    formData.append("x-amz-date", uploadCreds["x-amz-date"]);
    formData.append("x-amz-credential", uploadCreds["x-amz-credential"]);
    formData.append("success_action_status", 201);
    formData.append("success_action_redirect", "");
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadCreds.uploadLink);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);

        handleUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 201) {
        handleUploadProgress(100);
        resolve({
          status: "success",
          message: "File uploaded successfully",
          data: xhr.response,
        });
      } else {
        reject({
          status: "error",
          message: `Upload failed with status ${xhr.status}`,
          data: xhr.responseText,
        });
      }
    };

    xhr.onerror = () => {
      reject({
        status: "error",
        message: "An error occurred during file upload",
      });
    };

    xhr.send(formData);
  });
};
