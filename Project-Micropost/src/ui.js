class UI {
  constructor() {
    this.post = document.querySelector("#posts");
    this.titleInput = document.querySelector("#title");
    this.bodyInput = document.querySelector("#body");
    this.idInput = document.querySelector("#id");
    this.postSubmit = document.querySelector(".post-submit");
    this.postsContainer = document.querySelector(".posts-container");
    this.cardForm = document.querySelector(".card-form");
    this.forState = "add";
  }

  showPosts(posts) {
    let output = "";

    posts.forEach(post => {
      output += `
        <div class="card mb-3">
          <div class="card-body">
            <h4 class="card-title">${post.title}</h4>
            <p class="card-text">${post.body}</p>
            <a href="#" class="edit card-link" data-id="${post.id}">
              <i class="fa fa-pencil-alt"></i>
            </a>
            <a href="#" class="delete card-link" data-id="${post.id}">
              <i class="fa fa-times"></i>
            </a>
          </div>
        </div>
      `;
    });

    this.post.innerHTML = output;
  }

  showAlert(message, type) {
    this.clearAlert();

    // Create div
    const div = document.createElement("div");
    // Add class
    div.className = `alert alert-${type}`;
    // Add text
    div.textContent = message;
    // Insert to DOM
    this.postsContainer.insertBefore(div, this.post);
    // Timeout
    setTimeout(() => {
      this.clearAlert();
    }, 3000);
  }

  clearAlert() {
    const currentAlert = document.querySelector(".alert");

    if (currentAlert) {
      currentAlert.remove();
    }
  }

  clearForm() {
    this.titleInput.value = "";
    this.bodyInput.value = "";
  }

  fillForm(selectedPost) {
    this.titleInput.value = selectedPost.title;
    this.bodyInput.value = selectedPost.body;
    this.idInput.value = selectedPost.id;
  }

  clearIdInput() {
    this.idInput.value = "";
  }

  toggleFormState(state) {
    if (state === "edit") {
      this.forState = state;
      this.postSubmit.textContent = "Save Changes";
      this.postSubmit.className = "post-submit btn btn-success btn-block";
      // Create cancel btn
      const button = document.createElement("button");
      button.className = "post-cancel btn btn-warning btn-block";
      button.textContent = "Cancel Edit";
      // Append btn
      this.cardForm.appendChild(button);
    } else if (state === "add") {
      this.forState = state;
      this.postSubmit.textContent = "Post it";
      this.postSubmit.className = "post-submit btn btn-primary btn-block";
      // Remove btn if is
      if (document.querySelector(".post-cancel")) {
        document.querySelector(".post-cancel").remove();
      }
      // Clear hidden ID field
      this.clearIdInput();
      // Clear Form
      this.clearForm();
    }
  }
}

export const ui = new UI();
