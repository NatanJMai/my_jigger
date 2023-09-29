class Admin::MenusController < AdminController
  before_action :set_menu, only: [:show, :edit, :update, :destroy]
  before_action :set_organization

  # GET /menus or /menus.json
  def index
    @menus = @organization.menus
  end

  # GET /menus/1 or /menus/1.json
  def show
    redirect_to admin_menu_menu_sections_url(@menu)
  end

  # GET /menus/new
  def new
    @menu = @organization.menus.new
    respond_to do |format|
      format.html
      format.js
    end
  end

  # GET /menus/1/edit
  def edit
  end

  # POST /menus or /menus.json
  def create
    @menu = @organization.menus.new(menu_params)

    respond_to do |format|
      if @menu.save
        format.html { redirect_to admin_organization_menus_path(@organization), notice: "Menu was successfully created." }
        format.json { render :show, status: :created, location: @menu }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @menu.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /menus/1 or /menus/1.json
  def update
    respond_to do |format|
      if @menu.update(menu_params)
        format.html { redirect_to admin_organization_menus_path(@organization), notice: "Menu was successfully updated." }
        format.json { render :show, status: :ok, location: @menu }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @menu.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /menus/1 or /menus/1.json
  def destroy
    @organization = @menu.organization
    @menu.destroy

    respond_to do |format|
      format.html { redirect_to admin_organization_menus_path(@organization), notice: "Menu was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_menu
      @menu = Menu.find_by(id: params[:id])
    end

  # Use callbacks to share common setup or constraints between actions.
  def set_organization
    if @menu.present?
      @organization = @menu.organization
    else
      @organization = Organization.find_by(id: params[:organization_id])
    end
  end

    # Only allow a list of trusted parameters through.
    def menu_params
      params.require(:menu).permit(:name, :description, :release_date,
                                   :status, :organization_id)
    end
end
