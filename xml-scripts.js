/* Utils */

const setStars = (numberOfStars) => {
  const stars = [];

  for (let i = 0; i < 5; i++)
    stars.push(`<div class="star star--${i < numberOfStars ? "active" : "disabled"}"></div>`);

  return (stars.join("\n"));
};

const fetchFilterOptions = () => {
  const url = "https://smileschool-api.hbtn.info/xml/courses";
  $.get(url)
    .done((data) => {
      const topicDropdownBtn = $("#topicDropdown button");
      const topicOptions = $("#topicDropdown .dropdown-menu");
      const sortDropdownBtn = $("#sortDropdown button");
      const sortOptions = $("#sortDropdown .dropdown-menu");

      const res = $(data);
      const topic = res.find("result > topic").text();
      const sort = res.find("result > sort").text();

      const defaultValueTopic = $(`<span class="text-capitalize" id="selected-topic" data-value="${topic}">${topic}</span>`);
      topicDropdownBtn.append(defaultValueTopic);


      res.find("topics > topic").each(function () {
        const topicOption = $(this).text();
        const newOption = $(`<a class="dropdown-item w-100 text-capitalize" href="#" data-value="${topicOption}">${topicOption}</a>`);
        topicOptions.append(newOption);
      });

      const defaultValueSort = $(`<span class="text-capitalize" id="selected-sort" data-value="${sort}">${sort.replace("_", " ")}</span>`);
      sortDropdownBtn.append(defaultValueSort);

      res.find("sorts > sort").each(function () {
        const sortOption = $(this).text();
        const newOption = $(`<a class="dropdown-item w-100 text-capitalize" href="#" data-value="${sortOption}">${sortOption.replace("_", " ")}</a>`);
        sortOptions.append(newOption);
      });

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

  $.get("https://smileschool-api.hbtn.info/xml/quotes")
    .done((quotes) => {
      let idx = 0;

      $(quotes).find("quote").each(function () {
        const self = $(this);
        const picUrl = self.find("pic_url").text();
        const name = self.find("name").text();
        const title = self.find("title").text();
        const text = self.find("text").text();

        const newQuote = $(`
        <div class="${idx === 0 ? "active " : ""}carousel-item" data-interval="10000">
          <div class="review mx-auto">
            <figure class="review__profile-container mx-auto mx-md-0">
              <img class="img-fluid rounded-circle" src="${picUrl}" alt="${name} profile photo">
            </figure>
            <div class="review__text-container px-2">
              <p class="font-weight-ligth my-4">${text}</p>
              <p class="font-weight-bold mb-0">${name}</p>
              <p class="font-italic font-weight-light m-0">${title}</p>
            </div>
          </div>
        </div>`);
        quotesContainer.append(newQuote);
        idx++;
        $("#carouselReview").removeClass("loader");
      });
    })
    .fail((err) => alert(err));
};

const getTutorials = () => {
  const tutorialsContainer = $("#carouselTutorial .carousel-inner-tutorials");

  $.get("https://smileschool-api.hbtn.info/xml/popular-tutorials")
    .done((tutorials) => {
      let idx = 0;

      $(tutorials).find("video").each(function () {
        const self = $(this);
        const thumbUrl = self.find("thumb_url").text();
        const title = self.find("title").text();
        const subTitle = self.find("sub-title").text();
        const authorPicUrl = self.find("author_pic_url").text();
        const author = self.find("author").text();
        const star = self.attr("star");
        const duration = self.find("duration").text();

        const newTutorial = $(`
        <div class="${idx === 0 ? "active " : ""}carousel-item">
          <div class="text-dark mx-auto col-12 col-sm-6 col-xl-3">
            <div class="card mx-auto">
              <div class="position-relative">
                <img src="${thumbUrl}" class="card-img-top">
                <img class="card-play position-absolute" src="assets/images/play.png">
              </div>
              <div class="card-body">
                <div class="card-text">
                  <p class="card-text__title font-weight-bold mb-2">${title}</p>
                  <p class="card-text__summary text-muted">${subTitle}</p>
                </div>
                <div class="video-info-container">
                  <figure class="author_info-container d-flex">
                    <img class="rounded-circle img-fluid" src="${authorPicUrl}" alt="">
                    <figcaption class="pt-2 font-weight-bold">${author}</figcaption>
                  </figure>
                <div class="video-stats-container d-flex justify-content-between align-items-center">
                  <div class="video-rate d-flex">
                    ${setStars(star)}
                  </div>
                  <span class="video_duration font-weight-bold">${duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>`);

        tutorialsContainer.append(newTutorial);
        idx++;
      });

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

  $.get("https://smileschool-api.hbtn.info/xml/latest-videos")
    .done((videos) => {
      let idx = 0;

      $(videos).find("video").each(function () {
        const self = $(this);
        const thumbUrl = self.find("thumb_url").text();
        const title = self.find("title").text();
        const subTitle = self.find("sub-title").text();
        const authorPicUrl = self.find("author_pic_url").text();
        const author = self.find("author").text();
        const star = self.attr("star");
        const duration = self.find("duration").text();

        const newVideo = $(`
        <div class="${idx === 0 ? "active " : ""}carousel-item">
          <div class="text-dark mx-auto col-12 col-sm-6 col-xl-3">
            <div class="card mx-auto">
              <div class="position-relative">
                <img src="${thumbUrl}" class="card-img-top">
                <img class="card-play position-absolute" src="assets/images/play.png">
              </div>
              <div class="card-body">
                <div class="card-text">
                  <p class="card-text__title font-weight-bold mb-2">${title}</p>
                  <p class="card-text__summary text-muted">${subTitle}</p>
                </div>
                <div class="video-info-container">
                  <figure class="author_info-container d-flex">
                    <img class="rounded-circle img-fluid" src="${authorPicUrl}" alt="">
                    <figcaption class="pt-2 font-weight-bold">${author}</figcaption>
                  </figure>
                <div class="video-stats-container d-flex justify-content-between align-items-center">
                  <div class="video-rate d-flex">
                    ${setStars(star)}
                  </div>
                  <span class="video_duration font-weight-bold">${duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>`);

        videosContainer.append(newVideo);
        idx++;
      });

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
  const url = "https://smileschool-api.hbtn.info/xml/courses";
  const keywordValue = $('#selected-keyword').val();
  const topicValue = $('#selected-topic').attr("data-value");
  const sortValue = $('#selected-sort').attr("data-value");

  $.get(`${url}?q=${keywordValue}&topic=${topicValue}&sort=${sortValue}`)
    .done((data) => {
      const courseQuantity = $(".dinamic-quantity");
      const resultsContainer = $(".results");

      const res = $(data);
      const resQuantity = res.find("courses > course").length;
      courseQuantity.text(`${resQuantity} video${resQuantity !== 1 ? "s" : ""}`);

      resultsContainer.empty();

      $(data).find("courses > course").each(function () {
        const self = $(this);
        const title = self.find("title").text();
        const subTitle = self.find("sub-title").text();
        const authorPicUrl = self.find("author_pic_url").text();
        const author = self.find("author").text();
        const star = self.attr("star");
        const duration = self.find("duration").text();

        const newResult = $(`
        <div class="col-12 col-md-4 col-lg-3">
          <div class="card text-dark mx-auto">
            <div class="position-relative">
              <img src="assets/images/thumbnail_4.jpg" class="card-img-top">
              <img class="card-play position-absolute" src="assets/images/play.png">
            </div>
            <div class="card-body">
              <div class="card-text">
                <p class="card-text__title font-weight-bold mb-2">${title}</p>
                <p class="card-text__summary text-muted">${subTitle}</p>
              </div>
              <div class="video-info-container">
                <figure class="author_info-container d-flex">
                  <img class="rounded-circle img-fluid" src="${authorPicUrl}" alt="Profile photo of ${author}">
                  <figcaption class="pt-2 font-weight-bold">${author}</figcaption>
                </figure>
                <div class="video-stats-container d-flex justify-content-between align-items-center">
                  <div class="video-rate d-flex">
                    ${setStars(star)}
                  </div>
                  <span class="video_duration font-weight-bold">${duration}</span>
                </div>
              </div>
            </div>
          </div>
        </div>`);
        resultsContainer.append(newResult);
      });
    })
    .fail((err) => alert(err));

};

$(() => {
  getQuotes();
  getTutorials();
  getVideos();
  fetchFilterOptions();
});
