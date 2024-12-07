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
        let message = renderPartial({ title: data.title, body: data.body });
        element.insertAdjacentHTML('beforeend', message);
      }
    });
})

function renderPartial(content) {
  const partialTemplate = `
    <p class="import-log-info">
      ${content.title}
      ${content.body}
    </p>
  `;

  // Return the generated HTML string
  return partialTemplate;
}

