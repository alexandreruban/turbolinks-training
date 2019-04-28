const { defer, dispatch } = Turbolinks

const handleEvent = (eventName, handler) => {
  document.addEventListener(eventName, handler, false)
}

const translateEvent = ({ from, to }) => {
  const handler = (event) => {
    const compatible_event = dispatch(to, {
        target: event.target,
        cancelable: event.cancelable,
        data: event.data
      }
    )
    if (compatible_event.defaultPrevented) {
      compatible_event.preventDefault()
    }
  }
  handleEvent(from, handler)
}

translateEvent({ from: "turbolinks:click", to: "page:before-change" })
translateEvent({ from: "turbolinks:request-start", to: "page:fetch" })
translateEvent({ from: "turbolinks:request-end", to: "page:receive" })
translateEvent({ from: "turbolinks:snapshot-save", to: "page:before-unload" })
translateEvent({ from: "turbolinks:snapshot-load", to: "page:restore" })
translateEvent({ from: "turbolinks:load", to: "page:change" })
translateEvent({ from: "turbolinks:load", to: "page:update" })

let loaded = false
handleEvent("DOMContentLoaded", () => {
  defer(() => {
    return loaded = true
  })
})

handleEvent("turbolinks:load", () => {
  if (loaded) {
    dispatch("page:load")
  }
})

if (typeof jQuery === "function") {
  jQuery(document).on("ajaxSuccess", (event, xhr, settings) => {
    if (jQuery.trim(xhr.responseText).length > 0) {
      dispatch("page-update")
    }
  })
}
