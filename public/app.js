window.addEventListener("DOMContentLoaded", function() {
  document.getElementById("dec").addEventListener(
    "click",
    function(e) {
      const xhr = new XMLHttpRequest();
      xhr.open("post", "/dec");

      const password = document.querySelector("input[name=password]").value;
      const salt = document.querySelector("input[name=salt]").value;
      const iv = document.querySelector("input[name=iv]").value;
      const encrypted = document.querySelector("input[name=encrypted]").value;

      let json = JSON.stringify({
        password: password,
        salt: salt,
        iv: iv,
        encrypted: encrypted
      });

      xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
      xhr.send(json);
      xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          console.log(xhr.response);
          document.querySelector("#decrypted").innerText = JSON.parse(xhr.response).decrypted;
        }
      });
    },
    false
  );
  
  
  document.getElementById("enc").addEventListener(
    "click",
    function(e) {
      const xhr = new XMLHttpRequest();
      xhr.open("post", "/enc");

      const password = document.querySelector("input[name=password]").value;
      const salt = document.querySelector("input[name=salt]").value;
      const plaintext = document.querySelector("input[name=plaintext]").value;

      let json = JSON.stringify({
        password: password,
        salt: salt,
        plaintext: plaintext
      });

      xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
      xhr.send(json);
      xhr.addEventListener("readystatechange", () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          console.log(xhr.response);
          
          document.querySelector("input[name=iv]").value = JSON.parse(xhr.response).iv;
          document.querySelector("input[name=encrypted]").value = JSON.parse(xhr.response).encrypted;
        }
      });
    },
    false
  );
});
