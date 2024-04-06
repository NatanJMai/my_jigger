class Admin::ProductsController < AdminController
  before_action :set_product, only: [:show, :edit, :update, :destroy ]
  before_action :set_organization, only: [:index, :create, :new, :edit, :update]

  # GET /admin/product#index
  def index
    @products = @organization.products
  end

  # GET /admin/org/product/1
  def show

  end

  # GET /admin/product#new
  def new
    @product = @organization.products.new
    respond_to do |format|
      format.html
      format.js
    end
  end

  # GET /admin//product/1/edit
  def edit
  end

  # POST /admin//product
  def create
    @product = @organization.products.new(product_params)

    respond_to do |format|
      if @product.save
        format.html { redirect_to admin_organization_products_path(@organization),
                                  notice: "Product was successfully created." }

        format.json { render :show, status: :created, location: @organization }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin//product/1
  def update
    respond_to do |format|
      if @product.update(product_params)
        format.html { redirect_to admin_organization_products_path(@organization), notice: "Product was successfully updated." }
        format.json { render :index, status: :ok, location: @organization }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @product.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin//product/1
  def destroy
    @organization = @product.organization
    @product.destroy

    respond_to do |format|
      format.html { redirect_to admin_organization_products_path(@organization), notice: "Product was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_organization
    if @product.present?
      @organization = @product.organization
    else
      @organization = Organization.find_by(id: params[:organization_id])
    end
  end

  def set_product
    @product = Product.find_by(id: params[:id])
  end

  # Only allow a list of trusted parameters through.
  def product_params
    params.require(:product).permit(:name, :description, :status,
                                    :price_cents,
                                    :organization_id, :unit, :volume,
                                    :prep_method, :best_before)
  end
end
