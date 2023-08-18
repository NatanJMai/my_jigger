class Admin::DepartmentsController < AdminController
  before_action :set_department,   only: [:show, :edit, :update, :destroy ]
  before_action :set_organization, only: [:index, :create, :new ]

  # GET /admin/departments#index
  def index
    @departments = @organization.departments
  end

  # GET /admin//departments/1
  def show
  end

  # GET /admin/departments#new
  def new
    @department = @organization.departments.new
  end

  # GET /admin//departments/1/edit
  def edit
  end

  # POST /admin//departments
  def create
    @department = @organization.departments.new(department_params)

    respond_to do |format|
      if @department.save
        format.html { redirect_to admin_department_url(@department), notice: "Department was successfully created." }
        format.json { render :show, status: :created, location: @department }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @department.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin//departments/1
  def update
    respond_to do |format|
      if @department.update(department_params)
        format.html { redirect_to admin_department_url(@department), notice: "Department was successfully updated." }
        format.json { render :show, status: :ok, location: @department }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @department.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin//departments/1
  def destroy
    @organization = @department.organization
    @department.destroy

    respond_to do |format|
      format.html { redirect_to admin_organization_departments_path(@organization), notice: "Department was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_organization
      @organization = Organization.find(params[:organization_id])
    end

    def set_department
      @department   = Department.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def department_params
      params.require(:department).permit(:name, :description, :status, :organization_id)
    end
end
