// Слайдеры

const clientsSwiper = new Swiper('.clients-swiper', {
  loop: true,
  spaceBetween: 20,
  centeredSlides: true,
  speed: 7000,
  autoplay: {
    delay: 10,
  },
  breakpoints: {
    320: {
      slidesPerView: 1.5,
      speed: 3000,
    },
    700: {
      slidesPerView: 3,
      speed: 5000,
    },
    992: {
      slidesPerView: 4,
      speed: 7000,
    },
  },
})

const testimonialsSwiper = new Swiper('.swiper', {
  slidesPerView: 3,
  spaceBetween: 20,
  navigation: {
    nextEl: '.testimonial-nav-next',
    prevEl: '.testimonial-nav-prev',
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    700: {
      slidesPerView: 2,
    },
    992: {
      slidesPerView: 3,
    },
  },
})

// Аккордеоны

const accordeonsTriggers = document.querySelectorAll('.faq-header')

accordeonsTriggers.forEach((header) => {
  header.addEventListener('click', () => {
    header.closest('.faq-item').classList.toggle('active')
  })
})

// Управление модальным окном

const modal = document.querySelector('.modal')
const openModalBtns = document.querySelectorAll('.open-modal-btn')
const closeModalBtns = document.querySelectorAll('.close-modal-btn')
const body = document.querySelector('body')
const lockPaddingEls = document.querySelectorAll('.lock-padding')

openModalBtns.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault()
    openModal()
  })
})

closeModalBtns.forEach((button) => {
  button.addEventListener('click', (e) => {
    e.preventDefault()
    closeModal()
  })
})

modal.addEventListener('click', (e) => {
  if (modal.classList.contains('active') && !e.target.closest('.modal-body')) {
    closeModal()
  }
})

function openModal() {
  bodyLock()
  modal.classList.add('active')
}

function closeModal() {
  bodyLock()
  modal.classList.remove('active')
}

function bodyLock() {
  const lockPaddingValue =
    window.innerWidth - document.querySelector('body').offsetWidth + 'px'

  if (body.classList.contains('lock')) {
    body.classList.remove('lock')
    lockPaddingEls.forEach((element) => {
      element.style.paddingRight = 0
    })
  } else {
    body.classList.add('lock')

    lockPaddingEls.forEach((element) => {
      element.style.paddingRight = lockPaddingValue
    })
  }
}

// Маска для телефона
document.addEventListener('DOMContentLoaded', () => {
  const imaskScript = document.createElement('script')
  imaskScript.src = 'https://unpkg.com/imask'
  document.querySelector('head').appendChild(imaskScript)

  const phones = document.querySelectorAll('.phone-input')

  setTimeout(() => {
    phones.forEach((phone) => {
      const phoneMask = IMask(phone, {
        mask: '+{7}(000)000-00-00',
      })
    })
  }, 2000)
})

// Обработка форм обратной связи

document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('form')

  forms.forEach((form) => {
    form.addEventListener('submit', formSend)

    async function formSend(e) {
      e.preventDefault()
      const thisForm = e.target

      const error = formValidate(thisForm)
      const formData = new FormData(thisForm)

      if (error === 0) {
        thisForm.classList.add('_sending')
        const response = await fetch('sendmail.php', {
          method: 'POST',
          body: formData,
        })
        if (response.ok) {
          const result = await response.json()
          thisForm.reset()
          thisForm.classList.remove('_sending')
          thisForm.querySelector('.form-status').innerText =
            'Форма успешно отправлена!'
          thisForm.querySelector('.form-status').classList.add('show-success')
          setTimeout(() => {
            form.querySelector('.form-status').classList.remove('show-success')
          }, 3000)
        } else {
          thisForm.classList.remove('_sending')
          thisForm.querySelector('.form-status').innerText =
            'Что-то пошло не так :('
          thisForm.querySelector('.form-status').classList.add('show')
          setTimeout(() => {
            thisForm.querySelector('.form-status').classList.remove('show')
          }, 3000)
        }
      } else {
        thisForm.querySelector('.form-status').innerText =
          'Заполните все поля формы'
        thisForm.querySelector('.form-status').classList.add('show')
        setTimeout(() => {
          thisForm.querySelector('.form-status').classList.remove('show')
        }, 3000)
      }
    }

    function formValidate(thisForm) {
      let error = 0
      const formRequired = thisForm.querySelectorAll('._required')

      for (let index = 0; index < formRequired.length; index++) {
        const input = formRequired[index]
        formRemoveError(input)

        if (
          input.getAttribute('type') === 'checkbox' &&
          input.checked === false
        ) {
          formAddError(input)
          error++
        }
        if (input.value === '') {
          formAddError(input)
          error++
        }
      }
      return error
    }

    function formAddError(input) {
      input.classList.add('_error')
    }
    function formRemoveError(input) {
      input.classList.remove('_error')
    }
  })
})
