function onlyNumbers() {
  console.log("ONLY NUMBERS");
  let inputTag = document.querySelector("#phone");
  inputTag.value = inputTag.value
    .replace(/[^+0-9]/g, "")
    .replace(/(\..*)\./g, "$1");
}
