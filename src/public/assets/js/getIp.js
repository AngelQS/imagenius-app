let input = document.querySelector("#phone");
intlTelInput(input, {
  initialCountry: "auto",
  formatOnDisplay: true,
  autoHideDialCode: false,
  nationalMode: true,
  separateDialCode: true,
  hiddenInput: "phoneNumber",
  geoIpLookup: function (callback) {
    $.get(`https://ipapi.co/json/`, function () {}, "json").always(function (
      ipapi
    ) {
      console.log("IPAPI:", ipapi);
      const countryCode = ipapi.country || "";
      callback(countryCode);
    });
  },
  utilsScript: "/assets/js/utils.js",
});
