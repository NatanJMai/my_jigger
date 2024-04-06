class Unit < ClassyEnum::Base
end

class Unit::Ml < Unit
  def text
    'ML'
  end
end

class Unit::Liter < Unit
  def text
    'Liter'
  end
end

class Unit::G < Unit
  def text
    'G'
  end
end

class Unit::Kg < Unit
  def text
    'KG'
  end
end

class Unit::Und < Unit
  def text
    'Und'
  end
end
