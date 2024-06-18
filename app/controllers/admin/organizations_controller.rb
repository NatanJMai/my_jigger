class Admin::OrganizationsController < AdminController
  before_action :set_organization, only: %i[show edit update destroy]

  # GET /organizations or /organizations.json
  def index
    @organizations = current_user.organizations
  end

  # GET /organizations/1 or /organizations/1.json
  def show
  end

  # GET /organizations/new
  def new
    @organization = current_user.organizations.new
  end

  # GET /organizations/1/edit
  def edit
  end

  # POST /organizations or /organizations.json
  def create
    @organization = current_user.organizations.new()

    respond_to do |format|
      if @organization.update(organization_params)
        format.html { redirect_to admin_organizations_url, notice: "Organization was successfully created." }
        format.json { render :show, status: :created, location: @organization }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @organization.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /organizations/1 or /organizations/1.json
  def update
    respond_to do |format|
      if @organization.update(organization_params)
        format.html { redirect_to admin_organization_url(@organization), notice: "Organization was successfully updated." }
        format.json { render :show, status: :ok, location: @organization }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @organization.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /organizations/1 or /organizations/1.json
  def destroy
    @organization.destroy

    respond_to do |format|
      format.html { redirect_to admin_organizations_url, notice: "Organization was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_organization
      @organization = Organization.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def organization_params
      params.require(:organization).permit(:name, :email, :address, :site)
    end
end
