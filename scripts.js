/* Utils */

const setStars = (numberOfStars) => {
  const stars = [];

  for (let i = 0; i < 5; i++)
    stars.push(`<div class="star star--${i < numberOfStars ? "active" : "disabled"}"></div>`);

  return (stars.join("\n"));
};

const fetchFilterOptions = () => {
  const url = "https://smileschool-api.hbtn.info/courses";
  $.get(url)
    .done((data) => {
      const topicDropdownBtn = $("#topicDropdown button");
      const topicOptions = $("#topicDropdown .dropdown-menu");
      const sortDropdownBtn = $("#sortDropdown button");
      const sortOptions = $("#sortDropdown .dropdown-menu");

      const defaultValueTopic = $(`<span class="text-capitalize" id="selected-topic" data-value="${data.topic}">${data.topic}</span>`);
      topicDropdownBtn.append(defaultValueTopic);

      for (const topicOption of data.topics) {
        const newOption = $(`<a class="dropdown-item w-100 text-capitalize" href="#" data-value="${topicOption}">${topicOption}</a>`);
        topicOptions.append(newOption);
      }

      const defaultValueSort = $(`<span class="text-capitalize" id="selected-sort" data-value="${data.sort}">${data.sort.replace("_", " ")}</span>`);
      sortDropdownBtn.append(defaultValueSort);

      for (const sortOption of data.sorts) {
        const newOption = $(`<a class="dropdown-item w-100 text-capitalize" href="#" data-value="${sortOption}">${sortOption.replace("_", " ")}</a>`);
        sortOptions.append(newOption);
      }

      $('#selected-keyword').keypress(function (e) {
        if (e.which == 13) {
          getCourses();
          return false;
        }
      });

      $('#sortDropdown a').click(function (e) {
        e.preventDefault();
        $('#selected-sort').text($(this).text());
        $('#selected-sort').attr("data-value", $(this).attr("data-value"));
        getCourses();
      });

      $('#topicDropdown a').click(function (e) {
        e.preventDefault();
        $('#selected-topic').text($(this).text());
        $('#selected-topic').attr("data-value", $(this).attr("data-value"));
        getCourses();
      });

      getCourses();

    })
    .fail((err) => alert(err));

};
/* Principal Functions */

const getQuotes = () => {
  const quotesContainer = $(".carousel-inner-quotes");

  $.get("https://smileschool-api.hbtn.info/quotes")
    .done((quotes) => {
      let idx = 0;

      for (const quote of quotes) {
        const newQuote = $(`
        <div class="${idx === 0 ? "active " : ""}carousel-item" data-interval="10000">
          <div class="review mx-auto">
            <figure class="review__profile-container mx-auto mx-md-0">
              <img class="img-fluid rounded-circle" src="${quote.pic_url}" alt="${quote.name} profile photo">
            </figure>
            <div class="review__text-container px-2">
              <p class="font-weight-ligth my-4">${quote.text}</p>
              <p class="font-weight-bold mb-0">${quote.name}</p>
              <p class="font-italic font-weight-light m-0">${quote.title}</p>
            </div>
          </div>
        </div>`);
        quotesContainer.append(newQuote);
        idx++;
      };
      $("#carouselReview").removeClass("loader");
    })
    .fail((err) => alert(err));
};

const getTutorials = () => {
  const tutorialsContainer = $("#carouselTutorial .carousel-inner-tutorials");

  $.get("https://smileschool-api.hbtn.info/popular-tutorials")
    .done((tutorials) => {
      let idx = 0;

      for (const tutorial of tutorials) {
        const newTutorial = $(`
        <div class="${idx === 0 ? "active " : ""}carousel-item">
          <div class="text-dark mx-auto col-12 col-sm-6 col-xl-3">
            <div class="card mx-auto">
              <div class="position-relative">
                <img src="${tutorial.thumb_url}" class="card-img-top">
                <img class="card-play position-absolute" src="assets/images/play.png">
              </div>
              <div class="card-body">
                <div class="card-text">
                  <p class="card-text__title font-weight-bold mb-2">${tutorial.title}</p>
                  <p class="card-text__summary text-muted">${tutorial["sub-title"]}</p>
                </div>
                <div class="video-info-container">
                  <figure class="author_info-container d-flex">
                    <img class="rounded-circle img-fluid" src="${tutorial.author_pic_url}" alt="">
                    <figcaption class="pt-2 font-weight-bold">${tutorial.author}</figcaption>
                  </figure>
                <div class="video-stats-container d-flex justify-content-between align-items-center">
                  <div class="video-rate d-flex">
                    ${setStars(tutorial.star)}
                  </div>
                  <span class="video_duration font-weight-bold">${tutorial.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>`);

        tutorialsContainer.append(newTutorial);
        idx++;
      };

      $('#carouselTutorial .carousel-inner-tutorials .carousel-item').each(function () {
        let next = $(this).next();
        if (!next.length)
          next = $(this).siblings(':first');

        next.children(':first-child').clone().appendTo($(this));

        for (let i = 0; i < 3; i++) {
          next = next.next();
          if (!next.length)
            next = $(this).siblings(':first');

          next.children(':first-child').clone().appendTo($(this));
        }
      });

      tutorialsContainer.removeClass("loader");

    })
    .fail((err) => alert(err));

};

const getVideos = () => {
  const videosContainer = $("#carouselVideos .carousel-inner-videos");

  $.get("https://smileschool-api.hbtn.info/latest-videos")
    .done((videos) => {
      let idx = 0;

      for (const video of videos) {
        const newVideo = $(`
        <div class="${idx === 0 ? "active " : ""}carousel-item">
          <div class="text-dark mx-auto col-12 col-sm-6 col-xl-3">
            <div class="card mx-auto">
              <div class="position-relative">
                <img src="${video.thumb_url}" class="card-img-top">
                <img class="card-play position-absolute" src="assets/images/play.png">
              </div>
              <div class="card-body">
                <div class="card-text">
                  <p class="card-text__title font-weight-bold mb-2">${video.title}</p>
                  <p class="card-text__summary text-muted">${video["sub-title"]}</p>
                </div>
                <div class="video-info-container">
                  <figure class="author_info-container d-flex">
                    <img class="rounded-circle img-fluid" src="${video.author_pic_url}" alt="">
                    <figcaption class="pt-2 font-weight-bold">${video.author}</figcaption>
                  </figure>
                <div class="video-stats-container d-flex justify-content-between align-items-center">
                  <div class="video-rate d-flex">
                    ${setStars(video.star)}
                  </div>
                  <span class="video_duration font-weight-bold">${video.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>`);

        videosContainer.append(newVideo);
        idx++;
      };

      $('#carouselVideos .carousel-inner-videos .carousel-item').each(function () {
        let next = $(this).next();
        if (!next.length)
          next = $(this).siblings(':first');

        next.children(':first-child').clone().appendTo($(this));

        for (let i = 0; i < 3; i++) {
          next = next.next();
          if (!next.length)
            next = $(this).siblings(':first');

          next.children(':first-child').clone().appendTo($(this));
        }
      });

      videosContainer.removeClass("loader");

    })
    .fail((err) => alert(err));

};

const getCourses = () => {
  const url = "https://smileschool-api.hbtn.info/courses";
  const keywordValue = $('#selected-keyword').val();
  const topicValue = $('#selected-topic').attr("data-value");
  const sortValue = $('#selected-sort').attr("data-value");

  $.get(`${url}?q=${keywordValue}&topic=${topicValue}&sort=${sortValue}`)
    .done(({ courses }) => {
      const courseQuantity = $(".dinamic-quantity");
      const resultsContainer = $(".results");

      courseQuantity.text(`${courses.length} video${courses.length !== 1 ? "s" : ""}`);

      resultsContainer.empty();

      for (const course of courses) {
        const newResult = $(`
        <div class="col-12 col-md-4 col-lg-3">
          <div class="card text-dark mx-auto">
            <div class="position-relative">
              <img src="assets/images/thumbnail_4.jpg" class="card-img-top">
              <img class="card-play position-absolute" src="assets/images/play.png">
            </div>
            <div class="card-body">
              <div class="card-text">
                <p class="card-text__title font-weight-bold mb-2">${course.title}</p>
                <p class="card-text__summary text-muted">${course["sub-title"]}</p>
              </div>
              <div class="video-info-container">
                <figure class="author_info-container d-flex">
                  <img class="rounded-circle img-fluid" src="${course.author_pic_url}" alt="Profile photo of ${course.author}">
                  <figcaption class="pt-2 font-weight-bold">${course.author}</figcaption>
                </figure>
                <div class="video-stats-container d-flex justify-content-between align-items-center">
                  <div class="video-rate d-flex">
                    ${setStars(course.star)}
                  </div>
                  <span class="video_duration font-weight-bold">${course.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>`);
        resultsContainer.append(newResult);
      }
    })
    .fail((err) => alert(err));

};

$(() => {
  getQuotes();
  getTutorials();
  getVideos();
  fetchFilterOptions();
});
