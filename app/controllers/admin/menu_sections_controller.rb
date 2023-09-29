class Admin::MenuSectionsController < AdminController
  before_action :set_menu_section, only: [:show, :edit, :update, :destroy]
  before_action :set_menu

  # GET /menu_sections or /menu_sections.json
  def index
    @menu_sections = @menu.menu_sections
  end

  # GET /menu_sections/1 or /menu_sections/1.json
  def show
  end

  # GET /menu_sections/new
  def new
    @menu_section = @menu.menu_sections.new
    respond_to do |format|
      format.html
      format.js
    end
  end

  # GET /menu_sections/1/edit
  def edit
  end

  # POST /menu_sections or /menu_sections.json
  def create
    @menu_section = @menu.menu_sections.new(menu_section_params)

    respond_to do |format|
      if @menu_section.save
        format.html { redirect_to admin_menu_menu_sections_path(@menu),
                                  notice: "Menu section was successfully created." }
        format.json { render :show, status: :created, location: @menu_section }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @menu_section.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /menu_sections/1 or /menu_sections/1.json
  def update
    respond_to do |format|
      if @menu_section.update(menu_section_params)
        format.html { redirect_to admin_menu_menu_sections_path(@menu),
                                  notice: "Menu section was successfully updated." }
        format.json { render :show, status: :ok, location: @menu_section }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @menu_section.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /menu_sections/1 or /menu_sections/1.json
  def destroy
    @menu_section.destroy

    respond_to do |format|
      format.html { redirect_to admin_menu_menu_sections_path(@menu), notice: "Menu section was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_menu_section
      @menu_section = MenuSection.find(params[:id])
    end

  # Use callbacks to share common setup or constraints between actions.
  def set_menu
    if @menu_section.present?
      @menu = @menu_section.menu
    else
      @menu = Menu.find_by(id: params[:menu_id])
    end
  end

    # Only allow a list of trusted parameters through.
    def menu_section_params
      params.require(:menu_section).permit(:name, :status, :menu_id)
    end
end
