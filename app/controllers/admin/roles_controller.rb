class Admin::RolesController < AdminController
  before_action :set_role,       only: [:show, :edit, :update, :destroy ]
  before_action :set_department, only: [:index, :create, :new ]

  # GET /roles or /roles.json
  def index
    @roles = @department.roles
  end

  # GET /roles/1 or /roles/1.json
  def show
  end

  # GET /roles/new
  def new
    @role = @department.roles.new
  end

  # GET /roles/1/edit
  def edit
  end

  # POST /roles or /roles.json
  def create
    @role = @department.roles.new(role_params)

    respond_to do |format|
      if @role.save
        format.html { redirect_to admin_role_url(@role), notice: "Role was successfully created." }
        format.json { render :show, status: :created, location: @role }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @role.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /roles/1 or /roles/1.json
  def update
    respond_to do |format|
      if @role.update(role_params)
        format.html { redirect_to admin_role_url(@role), notice: "Role was successfully updated." }
        format.json { render :show, status: :ok, location: @role }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @role.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /roles/1 or /roles/1.json
  def destroy
    @department = @role.department
    @role.destroy

    respond_to do |format|
      format.html { redirect_to admin_department_roles_url(@department), notice: "Role was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_role
      @role = Role.find(params[:id])
    end

    def set_department
      @department = Department.find(params[:department_id])
    end

    # Only allow a list of trusted parameters through.
    def role_params
      params.require(:role).permit(
        :name, :description, :status,
        :department_id, :permission,
      )
    end
end
