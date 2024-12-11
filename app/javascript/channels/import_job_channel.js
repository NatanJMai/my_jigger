import consumer from "./consumer"

document.addEventListener('turbo:load', () => {
  const element = document.getElementById('import-job-id');
  const import_job_id = element?.getAttribute('data-import-job-id');

  consumer.subscriptions.create({ channel: "ImportJobChannel", import_job_id: import_job_id }, {
      connected() {
        console.log('connected to ' + import_job_id);
        // Called when the subscription is ready for use on the server
      },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
        // 'data' is the array of hashes received
        data.forEach(item => {
          // Dynamically generate HTML for each item
          let message = renderPartial(item);
          element.insertAdjacentHTML('beforeend', message);
        });
      }
    });
})

// renderPartial function
function renderPartial(item) {
  // Generate HTML dynamically from the keys and values of the object
  let details = Object.keys(item)
    .map(key => `<p>${key.replace(/_/g, ' ')}: ${item[key]}</p>`)
    .join('');

  return `<div class="import-log-info"><h3>${item.name}</h3>${details}</div>`;
}

