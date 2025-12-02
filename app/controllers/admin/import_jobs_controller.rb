require "pdf-reader"

class Admin::ImportJobsController < AdminController
  load_and_authorize_resource
  load_and_authorize_resource :organization
  load_and_authorize_resource :menu

  # Decorate assigned resources for view enhancements
  decorates_assigned :import_job, :import_jobs
  decorates_assigned :organization, :menu

  # GET /menus or /menus.json
  def index
    @import_jobs = current_organization.import_jobs
  end

  # GET /menus/1 or /menus/1.json
  def show
  end

  # GET /menus/new
  def new
    @import_job = current_organization.import_jobs.new
    respond_to do |format|
      format.html
      format.js
    end
  end

  # POST /menus or /menus.json
  def create
    uploaded_files = import_job_file_params[:files] || []

    current_organization = @organization
    current_user = @current_user
    menu = @menu
    topics = AiRecommendationTopic.all

    option_select = params[:option_select].presence || 'item'
    success_count = 0

    uploaded_files.each do |file_object|
      new_job = current_organization.import_jobs.new(import_job_params)

      new_job.user_id = current_user.id
      new_job.import_status = 'in_progress'
      new_job.file = file_object

      if new_job.save
        if option_select == 'pdf_document'
          Ai::MenuAnalysisService.new(current_organization, menu).pdf_analyse(new_job.file, topics)
        else
          FileProcessorWorker.perform_async(new_job.id, option_select)
        end

        success_count += 1
      else
        Rails.logger.error "Failed to save import job for file: #{file_object.original_filename} - Errors: #{new_job.errors.full_messages.to_sentence}"
      end
    end

    if success_count.positive?
      respond_to do |format|
        format.html {
          redirect_to admin_organization_import_jobs_path(current_organization),
                      notice: "#{success_count} document(s) uploaded successfully and processing started."
        }
      end
    elsif uploaded_files.empty?
      respond_to do |format|
        format.html {
          flash.now[:alert] = 'No files were selected for upload.'
          render :new, status: :unprocessable_entity
        }
      end
    else
      error_message = if success_count.zero? && uploaded_files.any?
                        'Failed to process selected files. One or more files may be corrupt or invalid.'
                      else
                        'Failed to process any of the selected files. Check server logs for details.'
                      end

      respond_to do |format|
        format.html {
          flash.now[:alert] = error_message
          render :new, status: :unprocessable_entity
        }
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
  

  private

  def import_job_file_params
    params.require(:import_job).permit(files: [])
  end

  def import_job_params
    params.require(:import_job).permit(
      :organization_id,
      :date,
      :import_status
    )
  end
end
