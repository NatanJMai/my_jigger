class Admin::UserOrganizationsController < AdminController
  before_action :set_record, only: [:update, :destroy ]
  before_action :set_organization, only: [:index, :create, :new, :update]

  # GET /UserOrganizations or /UserOrganizations.json
  def index
    @user_organizations = @organization.user_organizations
  end

  # GET /UserOrganizations/new
  def new
    @user_organization = @organization.user_organizations.new
  end

  # POST /UserOrganizations or /UserOrganizations.json
  def create
    @user_organization = @organization.user_organizations.new(user_organization_params)

    respond_to do |format|
      if @user_organization.save
        format.html { redirect_to admin_organization_user_organizations_path(@user_organization.organization),
                                  notice: "UserOrganization was successfully created." }

        format.json { render :show, status: :created, location: @user_organization }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @user_organization.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /UserOrganizations/1 or /UserOrganizations/1.json
  def update
    respond_to do |format|
      if @user_organization.update(user_organization_params)
        format.html {
          redirect_to admin_organization_user_organizations_path(@organization), notice: "UserOrganization was successfully updated."
        }

        format.json { render :index, status: :ok, location: @user_organization }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @user_organization.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /UserOrganizations/1 or /UserOrganizations/1.json
  def destroy
    @organization = @user_organization.organization
    @user_organization.destroy

    respond_to do |format|
      format.html { redirect_to admin_organization_path(@organization), notice: "UserOrganization was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_record
    @user_organization = UserOrganization.find_by(id: params[:id])
  end

  def set_organization
    if @user_organization.present?
      @organization = @user_organization.organization
    else
      @organization = Organization.find_by(id: params[:organization_id])
    end
  end

  # Only allow a list of trusted parameters through.
  def user_organization_params
    params.require(:user_organization).permit( :id, :user_id, :organization_id )
  end
end

