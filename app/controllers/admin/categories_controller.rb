class Admin::CategoriesController < AdminController
  before_action :set_category, only: %i[show edit update destroy]
  before_action :set_category

  # GET /items or /items.json
  def index
    @items = @category.items
  end

  # GET /items/1 or /items/1.json
  def show
    @items = @category.items
  end

  # GET /items/new
  def new
    @category = @organization.categories.new
    respond_to do |format|
      format.html
      format.js
    end
  end

  # GET /items/1/edit
  def edit
  end

  # POST /items or /items.json
  def create
    @category = @organization.categories.new(categories_params)

    respond_to do |format|
      if @category.save
        format.html do
          redirect_to admin_category_items_path(@category),
                      notice: 'Item was successfully created.'
        end

        format.json { render :show, status: :created, location: @category }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @category.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /items/1 or /items/1.json
  def update
    respond_to do |format|
      if @item.update(item_params)
        format.html do
          redirect_to admin_category_items_path(@category),
                      notice: 'Item was successfully updated.' end

        format.json { render :show, status: :ok, location: @item }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @item.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /items/1 or /items/1.json
  def destroy
    @item.destroy

    respond_to do |format|
      format.html do
        redirect_to admin_category_items_path(@category),
                    notice: 'Item was successfully destroyed.'
      end

      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_category
    @category = CallTemplate.find_by(id: params[:id])
  end

  def set_organization
    @organization = if @category.present?
                      @category.organization
                    else
                      Organization.find_by(id: params[:organization_id])
                    end
  end

  # Only allow a list of trusted parameters through.
  def categories_params
    full_attributes = %i[name status organization_id]

    params.require(:category).permit(full_attributes)
  end
end
