"use strict";

const LESSON_KEY = "de-guide-beginner-v1";

function readLessons() {
  try {
    return JSON.parse(localStorage.getItem(LESSON_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function writeLessons(done) {
  try {
    localStorage.setItem(LESSON_KEY, JSON.stringify(done));
  } catch (error) {
    // без хранилища страница работает, но отметки не сохраняются
  }
}

const doneLessons = readLessons();
const lessonBoxes = Array.from(document.querySelectorAll("input[data-lesson]"));

function updateLessonProgress() {
  const finished = lessonBoxes.filter(function (box) {
    return box.checked;
  }).length;
  const percent = Math.round((finished / lessonBoxes.length) * 100);
  document.getElementById("lessonBar").style.width = percent + "%";
  document.getElementById("lessonPct").textContent = percent + "%";
}

lessonBoxes.forEach(function (box) {
  box.checked = Boolean(doneLessons[box.dataset.lesson]);
  box.addEventListener("change", function () {
    if (box.checked) {
      doneLessons[box.dataset.lesson] = true;
    } else {
      delete doneLessons[box.dataset.lesson];
    }
    writeLessons(doneLessons);
    updateLessonProgress();
  });
});

const nav = document.getElementById("lessonNav");
document.querySelectorAll("section.lesson").forEach(function (section) {
  const link = document.createElement("a");
  link.href = "#" + section.id;
  link.textContent = section.dataset.title;
  nav.append(link);
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) {
        return;
      }
      nav.querySelectorAll("a").forEach(function (link) {
        const active = link.getAttribute("href") === "#" + entry.target.id;
        link.classList.toggle("active", active);
        if (active) {
          // двигаем только саму панель уроков: scrollIntoView дёргал бы и страницу
          nav.scrollTo({
            left: link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2,
            behavior: "instant"
          });
        }
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px" });
  document.querySelectorAll("section.lesson").forEach(function (section) {
    observer.observe(section);
  });
}

document.querySelectorAll("button.copy").forEach(function (button) {
  button.addEventListener("click", function () {
    const pre = button.parentElement.querySelector("pre");
    if (!pre || !navigator.clipboard) {
      return;
    }
    navigator.clipboard.writeText(pre.textContent).then(function () {
      const old = button.textContent;
      button.textContent = "Скопировано";
      setTimeout(function () {
        button.textContent = old;
      }, 1400);
    }, function () {});
  });
});

updateLessonProgress();
