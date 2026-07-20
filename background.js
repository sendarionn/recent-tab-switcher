const HISTORY_KEY = "tabHistory"

let history = []
let operation = Promise.resolve()

function runSequentially(task) {
  operation = operation.then(task, task)
  return operation
}

async function saveHistory() {
  await chrome.storage.session.set({ [HISTORY_KEY]: history })
}

async function restoreHistory() {
  const stored = await chrome.storage.session.get(HISTORY_KEY)

  if (Array.isArray(stored[HISTORY_KEY])) {
    history = stored[HISTORY_KEY]
  }

  const tabs = await chrome.tabs.query({})
  const existingTabIds = new Set(tabs.map((tab) => tab.id))
  history = history.filter((tabId) => existingTabIds.has(tabId))

  const missingTabs = tabs
    .filter((tab) => !history.includes(tab.id))
    .sort((a, b) => (b.lastAccessed ?? 0) - (a.lastAccessed ?? 0))

  history.push(...missingTabs.map((tab) => tab.id))
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
  const [activeTab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  })

  if (!activeTab?.id) {
    return
  }

  await recordActivation(activeTab.id)

  while (history.length > 1) {
    const previousTabId = history[1]

    try {
      const previousTab = await chrome.tabs.get(previousTabId)
      await chrome.tabs.update(previousTabId, { active: true })

      if (previousTab.windowId !== activeTab.windowId) {
        await chrome.windows.update(previousTab.windowId, { focused: true })
      }

      await recordActivation(previousTabId)
      return
    } catch {
      await removeFromHistory(previousTabId)
    }
  }
}

chrome.runtime.onInstalled.addListener(({ reason }) => {
  runSequentially(async () => {
    await restoreHistory()

    if (reason === "install") {
      await chrome.tabs.create({ url: "chrome://extensions/shortcuts" })
    }
  })
})

chrome.runtime.onStartup.addListener(() => {
  runSequentially(restoreHistory)
})

chrome.tabs.onActivated.addListener(({ tabId }) => {
  runSequentially(() => recordActivation(tabId))
})

chrome.tabs.onRemoved.addListener((tabId) => {
  runSequentially(() => removeFromHistory(tabId))
})

chrome.tabs.onReplaced.addListener((addedTabId, removedTabId) => {
  runSequentially(async () => {
    await removeFromHistory(removedTabId)
    await recordActivation(addedTabId)
  })
})

chrome.commands.onCommand.addListener((command) => {
  if (command === "switch-to-previous-tab") {
    runSequentially(switchToPreviousTab)
  }
})

runSequentially(restoreHistory)
