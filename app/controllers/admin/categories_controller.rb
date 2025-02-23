class Admin::CategoriesController < AdminController
  load_and_authorize_resource
  load_and_authorize_resource :organization
  load_and_authorize_resource :category, through: :organization

  decorates_assigned :category, :categories, :organization

  # GET /menus or /menus.json
  def index
    @categories = @organization.categories
  end

  # GET /menus/1 or /menus/1.json
  def show
  end

  # GET /menus/new
  def new
    @category = @organization.categories.new
    respond_to do |format|
      format.html
      format.js
    end
  end

  # GET /menus/1/edit
  def edit; end

  # POST /menus or /menus.json
  def create
    @category = @organization.categories.new(category_params)

    respond_to do |format|
      if @category.save
        format.html { redirect_to admin_organization_categories_path(@organization), notice: 'Category was successfully created.' }
        format.json { render :show, status: :created, location: @category }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /menus/1 or /menus/1.json
  def update
    respond_to do |format|
      if @category.update(menu_params)
        format.html { redirect_to admin_organization_categories_path(@organization), notice: 'Category was successfully updated.' }
        format.json { render :show, status: :ok, location: @category }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /menus/1 or /menus/1.json
  def destroy
    @organization = @category.organization
    @category.destroy

    respond_to do |format|
      format.html { redirect_to admin_organization_path(@organization), notice: 'Category was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Only allow a list of trusted parameters through.
  def category_params
    params.require(:category).permit(:name, :description, :status, :organization_id)
  end
end
