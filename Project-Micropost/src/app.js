import { http } from "./http";
import { ui } from "./ui";

// Get posts on DOM load
document.addEventListener("DOMContentLoaded", getPosts);

// Listen for POST
ui.postSubmit.addEventListener("click", postPost);

// Listen for DELETE
ui.post.addEventListener("click", deletePost);

// Listen for PUT
ui.post.addEventListener("click", putPost);

// Listen for cancel
ui.cardForm.addEventListener("click", cancelEdit);

function getPosts() {
  http
    .get("http://localhost:3000/posts")
    .then(data => ui.showPosts(data))
    .catch(err => console.log(err));
}

function postPost() {
  const title = ui.titleInput.value;
  const body = ui.bodyInput.value;
  const id = ui.idInput.value;

  if (title === "" || body === "") {
    ui.showAlert("Please fill in all fields", "warning");
  } else {
    if (ui.forState === "add") {
      // Get input
      const newPost = {
        title,
        body
      };
      // Send post request
      http
        .post("http://localhost:3000/posts", newPost)
        .then(data => {
          ui.showAlert("Post added", "success");
          ui.clearForm();
          getPosts();
        })
        .catch(err => console.log(err));
    } else if (ui.forState === "edit") {
      const updatedPost = {
        id,
        title,
        body
      };
      http
        .put(`http://localhost:3000/posts/${id}`, updatedPost)
        .then(data => {
          ui.showAlert("Post updated", "success");
          ui.toggleFormState("add");
          getPosts();
        })
        .catch(err => console.log(err));
    }
  }
}

function deletePost(e) {
  // Delegate to the remove button
  if (e.target.parentElement.className.includes("delete")) {
    ui.toggleFormState("add");
    // Get ID
    const id = e.target.parentElement.dataset.id;
    // Get confirmation
    if (confirm("Are you sure?")) {
      http
        .delete(`http://localhost:3000/posts/${id}`)
        .then(data => {
          ui.showAlert("Post Removed", "success");
          getPosts();
        })
        .catch(err => console.log(err));
    }
  }
  e.preventDefault();
}

function putPost(e) {
  // Delegate to the edit button
  if (e.target.parentElement.className.includes("edit")) {
    // Get ID
    const id = e.target.parentElement.dataset.id;
    // Get the data from backend
    http
      .get(`http://localhost:3000/posts/${id}`)
      .then(data => {
        // Populate the form
        const selectedPost = {
          id: data.id,
          title: data.title,
          body: data.body
        };
        ui.fillForm(selectedPost);
        ui.toggleFormState("edit");
      })
      .catch(err => console.log(err));
  }
  e.preventDefault();
}

function cancelEdit(e) {
  if (e.target.className.includes("post-cancel")) {
    ui.toggleFormState("add");
  }

  e.preventDefault();
}
