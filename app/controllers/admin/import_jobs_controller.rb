class Admin::ImportJobsController < AdminController

  before_action :set_organization

  load_and_authorize_resource
  # load_and_authorize_resource :organization
  # load_and_authorize_resource :import_job, through: :organization

  # Decorate assigned resources for view enhancements
  # decorates_assigned :import_job, :import_jobs
  decorates_assigned :organization

  # GET /menus or /menus.json
  def index
    @import_jobs = @organization.import_jobs
  end

  # GET /menus/1 or /menus/1.json
  def show
  end

  # GET /menus/new
  def new
    @import_job = @organization.import_jobs.new
    respond_to do |format|
      format.html
      format.js
    end
  end

  # POST /menus or /menus.json
  def create
    @import_job = @organization.import_jobs.new(import_job_params)
    @import_job.user_id = current_user.id
    @import_job.import_status = 'in_progress'

    # @import_job.import_logs.create!(date: Time.zone.now, log_type: 'info')

    if @import_job.save
      # Enqueue the worker to process the file
      FileProcessorWorker.perform_async(@import_job.id, 'item')

      # Render the document view to start real-time updates
      respond_to do |format|
        format.html {
          redirect_to admin_organization_import_job_path(@organization, @import_job),
                      notice: 'Document uploaded successfully. Processing started.'
        }
        # format.turbo_stream
      end
    else
      respond_to do |format|
        format.html { render :new, status: :unprocessable_entity }
        # format.turbo_stream { render turbo_stream: turbo_stream.replace('form-errors', partial: 'shared/form_errors', locals: { resource: @import_job }) }
      end
    end
  end

  # PATCH/PUT /menus/1 or /menus/1.json
  def update
    respond_to do |format|
      if @menu.update(menu_params)
        format.html { redirect_to admin_organization_menus_path(@organization), notice: 'Menu was successfully updated.' }
        format.json { render :show, status: :ok, location: @menu }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @menu.errors, status: :unprocessable_entity }
      end
    end
  end
  
  def set_organization
    @organization = Organization.find(params[:organization_id])
  end

  private

  # Only allow a list of trusted parameters through.
  def import_job_params
    params.require(:import_job).permit(:organization_organization_id, :file, :date, :import_status)
  end
end
