const HISTORY_KEY = "tabHistory"

let history = []
let operation = Promise.resolve()

function runSequentially(task) {
  operation = operation.then(task, task)
  return operation
}

async function saveHistory() {
  await browser.storage.local.set({ [HISTORY_KEY]: history })
}

async function restoreHistory() {
  const stored = await browser.storage.local.get(HISTORY_KEY)

  if (Array.isArray(stored[HISTORY_KEY])) {
    history = stored[HISTORY_KEY]
  }

  const tabs = await browser.tabs.query({})
  const existingTabIds = new Set(tabs.map((tab) => tab.id))
  history = history.filter((tabId) => existingTabIds.has(tabId))

  const missingTabIds = tabs
    .map((tab) => tab.id)
    .filter((tabId) => !history.includes(tabId))

  history.push(...missingTabIds)
  await saveHistory()
}

async function recordActivation(tabId) {
  history = [tabId, ...history.filter((id) => id !== tabId)]
  await saveHistory()
}

async function removeFromHistory(tabId) {
  history = history.filter((id) => id !== tabId)
  await saveHistory()
}

async function switchToPreviousTab() {
  const [activeTab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  })

  if (!activeTab?.id) {
    return
  }

  await recordActivation(activeTab.id)

  while (history.length > 1) {
    const previousTabId = history[1]

    try {
      const previousTab = await browser.tabs.get(previousTabId)
      await browser.tabs.update(previousTabId, { active: true })

      if (previousTab.windowId !== activeTab.windowId) {
        await browser.windows.update(previousTab.windowId, { focused: true })
      }

      await recordActivation(previousTabId)
      return
    } catch {
      await removeFromHistory(previousTabId)
    }
  }
}

browser.runtime.onInstalled.addListener(() => {
  runSequentially(restoreHistory)
})

browser.runtime.onStartup.addListener(() => {
  runSequentially(restoreHistory)
})

browser.tabs.onActivated.addListener(({ tabId }) => {
  runSequentially(() => recordActivation(tabId))
})

browser.tabs.onRemoved.addListener((tabId) => {
  runSequentially(() => removeFromHistory(tabId))
})

browser.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
  runSequentially(async () => {
    await removeFromHistory(removedTabId)
    await recordActivation(addedTabId)
  })
})

browser.commands.onCommand.addListener((command) => {
  if (command === "switch-to-previous-tab") {
    runSequentially(switchToPreviousTab)
  }
})

runSequentially(restoreHistory)
