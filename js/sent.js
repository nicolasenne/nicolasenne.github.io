const form = document.getElementById("my-form");

async function handleSubmit(event) {
  event.preventDefault();
  var status = document.getElementById("status");
  var data = new FormData(event.target);
  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
        'Accept': 'application/json'
    }
  }).then(response => {
    let btn = document.querySelector("button");
    btn.addEventListener("click", active);

    function active() {
      btn.classList.toggle("active");
    }

    form.reset()
  }).catch(error => {
    status.innerHTML = "Oops! There was a problem submitting your form"
  });
}

form.addEventListener("submit", handleSubmit)

const btn = document.querySelector("button");

btn.addEventListener("click", active);

function active() {
  btn.classList.toggle("active");
}