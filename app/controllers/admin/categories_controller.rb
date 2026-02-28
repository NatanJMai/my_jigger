class Admin::CategoriesController < AdminController
  load_and_authorize_resource
  load_and_authorize_resource :organization
  load_and_authorize_resource :category, through: :organization

  decorates_assigned :category, :categories, :organization

  # GET /menus or /menus.json
  def index
    @categories = @organization.categories.includes(:items)
  end

  # GET /menus/1 or /menus/1.json
  def show; end

  # GET /menus/new
  def new
    @category = @organization.categories.new
    render partial: 'form', locals: { category: @category, organization: @organization }
  end

  # GET /menus/1/edit
  def edit
    render partial: 'form', locals: { category: @category, organization: @organization }
  end

  # POST /menus or /menus.json
  def create
    @category = @organization.categories.new(category_params)

    if @category.save
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to admin_organization_categories_path(@organization) }
      end
    else
      respond_to do |format|
        format.turbo_stream { render :edit, status: :unprocessable_entity }
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /menus/1 or /menus/1.json
  def update
    if @category.update(category_params)
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to admin_organization_categories_path(@organization) }
      end
    else
      respond_to do |format|
        format.turbo_stream { render :edit, status: :unprocessable_entity }
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /menus/1 or /menus/1.json
  def destroy
    @organization = @category.organization
    @category.destroy

    respond_to do |format|
      format.html do
        redirect_to admin_organization_categories_path(@organization), notice: 'Category was successfully destroyed.'
      end
      format.json { head :no_content }
    end
  end

  private

  # Only allow a list of trusted parameters through.
  def category_params
    params.require(:category).permit(:name, :description, :status, :organization_id)
  end
end
