class Admin::MenusController < AdminController
  # before_action :set_menu
  # before_action :set_organization

  load_and_authorize_resource
  load_and_authorize_resource :item
  load_and_authorize_resource :organization
  load_and_authorize_resource :menu, through: :organization  # Load the menu for the given organization

  decorates_assigned :menus, :menu
  decorates_assigned :items

  # GET /menus or /menus.json
  def index
    @menus = @organization.menus.includes(:items)
  end

  # GET /menus/1 or /menus/1.json
  def show

  end

  def cost_analysis; end
  
  def best_items; end
  
  def matrix_popularity; end
  def sales_performance; end

  # GET /menus/new
  def new
    @menu = @organization.menus.new
    respond_to do |format|
      format.html
      format.js
    end
  end

  # GET /menus/1/edit
  def edit; end

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

  # Only allow a list of trusted parameters through.
  def menu_params
    params.require(:menu).permit(:name, :description, :release_date,
                                 :status, :organization_id)
  end
end
