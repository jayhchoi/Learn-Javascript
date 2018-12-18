import { http } from "./http";
import { ui } from "./ui";

// Get posts on DOM load
document.addEventListener("DOMContentLoaded", getPosts);

// Listen for form submit
ui.postSubmit.addEventListener("click", submitForm);

// Listen for DELETE
ui.post.addEventListener("click", deletePost);

// Listen for PUT
ui.post.addEventListener("click", putPost);

// Listen for cancel
ui.cardForm.addEventListener("click", cancelEdit);

// Send GET request and show on DOM
function getPosts() {
  http
    .get("http://localhost:3000/posts")
    .then(data => ui.showPosts(data))
    .catch(err => console.log(err));
}

// POST OR PUT
function submitForm() {
  // Get input values
  const title = ui.titleInput.value;
  const body = ui.bodyInput.value;
  const id = ui.idInput.value;

  // Input validation
  if (title === "" || body === "") {
    ui.showAlert("Please fill in all fields", "warning");
  } else {
    // POST REQUEST
    if (ui.forState === "add") {
      // "add" is the default state
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
          // Refetch the post on DOM
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
          // Refetch
          getPosts();
        })
        .catch(err => console.log(err));
    }
  }
}

function deletePost(e) {
  // Delegate to the remove button
  if (e.target.parentElement.className.includes("delete")) {
    // Get ID
    const id = e.target.parentElement.dataset.id;
    // Get confirmation
    if (confirm("Are you sure?")) {
      // Send DELETE REQUEST
      http
        .delete(`http://localhost:3000/posts/${id}`)
        .then(data => {
          ui.showAlert("Post Removed", "success");
          // Refetch
          getPosts();
        })
        .catch(err => console.log(err));
    }
  }
  ui.toggleFormState("add");
  e.preventDefault();
}

function putPost(e) {
  // Delegate to the edit button
  if (e.target.parentElement.className.includes("edit")) {
    // Get ID
    const id = e.target.parentElement.dataset.id;
    // Get the data from backend by sending GET REQUEST
    http
      .get(`http://localhost:3000/posts/${id}`)
      .then(data => {
        // Populate the form
        const selectedPost = {
          id: data.id,
          title: data.title,
          body: data.body
        };
        ui.toggleFormState("edit");
        ui.fillForm(selectedPost);
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
