import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import Modal from '../components/common/Modal';

describe('Modal', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('no renderiza nada cuando isOpen es false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test" message="Test message" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza el modal cuando isOpen es true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal" message="Test message" />
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('muestra el título correctamente', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Título Personalizado" message="Mensaje" />
    );
    expect(screen.getByText('Título Personalizado')).toBeInTheDocument();
  });

  it('muestra el mensaje correctamente', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test" message="Este es el mensaje principal" />
    );
    expect(screen.getByText('Este es el mensaje principal')).toBeInTheDocument();
  });

  it('muestra el submensaje cuando se proporciona', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={vi.fn()} 
        title="Test" 
        message="Mensaje principal"
        subMessage="Este es el submensaje"
      />
    );
    expect(screen.getByText('Este es el submensaje')).toBeInTheDocument();
  });

  it('no muestra submensaje cuando no se proporciona', () => {
    const { container } = render(
      <Modal 
        isOpen={true} 
        onClose={vi.fn()} 
        title="Test" 
        message="Mensaje principal"
      />
    );
    const subtext = container.querySelector('.modal__subtext');
    expect(subtext).not.toBeInTheDocument();
  });

  it('llama a onClose cuando se hace click en el overlay', () => {
    const mockOnClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test" message="Mensaje" />
    );
    
    const overlay = screen.getByText('Test').closest('.modal__overlay');
    fireEvent.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('no cierra el modal cuando se hace click en el contenido del modal', () => {
    const mockOnClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test" message="Mensaje" />
    );
    
    const modalContent = screen.getByText('Test').closest('.modal');
    fireEvent.click(modalContent);
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('muestra texto de botón por defecto "Aceptar"', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test" message="Mensaje" />
    );
    expect(screen.getByText('Aceptar')).toBeInTheDocument();
  });

  it('muestra texto de botón personalizado', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={vi.fn()} 
        title="Test" 
        message="Mensaje"
        confirmText="Confirmar Acción"
      />
    );
    expect(screen.getByText('Confirmar Acción')).toBeInTheDocument();
  });

  it('llama a onConfirm cuando se hace click en el botón de confirmar', () => {
    const mockOnConfirm = vi.fn();
    const mockOnClose = vi.fn();
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose} 
        onConfirm={mockOnConfirm}
        title="Test" 
        message="Mensaje"
      />
    );
    
    const confirmButton = screen.getByText('Aceptar');
    fireEvent.click(confirmButton);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('llama a onClose si no hay onConfirm al hacer click en confirmar', () => {
    const mockOnClose = vi.fn();
    render(
      <Modal 
        isOpen={true} 
        onClose={mockOnClose} 
        title="Test" 
        message="Mensaje"
      />
    );
    
    const confirmButton = screen.getByText('Aceptar');
    fireEvent.click(confirmButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  describe('Modal tipo "confirm"', () => {
    it('muestra botón de cancelar en modal de tipo confirm', () => {
      render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Confirmar Acción" 
          message="¿Estás seguro?"
          type="confirm"
        />
      );
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('muestra texto de cancelar personalizado', () => {
      render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Confirmar Acción" 
          message="¿Estás seguro?"
          type="confirm"
          cancelText="No, volver"
        />
      );
      expect(screen.getByText('No, volver')).toBeInTheDocument();
    });

    it('llama a onClose cuando se hace click en cancelar', () => {
      const mockOnClose = vi.fn();
      render(
        <Modal 
          isOpen={true} 
          onClose={mockOnClose} 
          title="Confirmar" 
          message="¿Estás seguro?"
          type="confirm"
        />
      );
      
      const cancelButton = screen.getByText('Cancelar');
      fireEvent.click(cancelButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('aplica clase de botón delete en tipo confirm', () => {
      render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Confirmar" 
          message="¿Estás seguro?"
          type="confirm"
        />
      );
      
      const confirmButton = screen.getByText('Aceptar');
      expect(confirmButton).toHaveClass('modal__btn--delete');
    });

    it('renderiza icono Trash2 para tipo confirm', () => {
      const { container } = render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Confirmar" 
          message="¿Estás seguro?"
          type="confirm"
        />
      );
      
      const iconWrapper = container.querySelector('.modal__icon-wrapper--confirm');
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe('Modal tipo "alert"', () => {
    it('no muestra botón de cancelar en modal de tipo alert', () => {
      render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Alerta" 
          message="Esto es una alerta"
          type="alert"
        />
      );
      expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
    });

    it('aplica clase de botón primary en tipo alert', () => {
      render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Alerta" 
          message="Mensaje"
          type="alert"
        />
      );
      
      const confirmButton = screen.getByText('Aceptar');
      expect(confirmButton).toHaveClass('modal__btn--primary');
    });

    it('renderiza icono Info para tipo alert', () => {
      const { container } = render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Alerta" 
          message="Mensaje"
          type="alert"
        />
      );
      
      const iconWrapper = container.querySelector('.modal__icon-wrapper--alert');
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe('Modal tipo "success"', () => {
    it('aplica clase de botón success en tipo success', () => {
      render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Éxito" 
          message="Operación exitosa"
          type="success"
        />
      );
      
      const confirmButton = screen.getByText('Aceptar');
      expect(confirmButton).toHaveClass('modal__btn--success');
    });

    it('renderiza icono CheckCircle para tipo success', () => {
      const { container } = render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Éxito" 
          message="Operación exitosa"
          type="success"
        />
      );
      
      const iconWrapper = container.querySelector('.modal__icon-wrapper--success');
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe('Modal tipo "error"', () => {
    it('aplica clase de botón delete en tipo error', () => {
      render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Error" 
          message="Ha ocurrido un error"
          type="error"
        />
      );
      
      const confirmButton = screen.getByText('Aceptar');
      expect(confirmButton).toHaveClass('modal__btn--delete');
    });

    it('renderiza icono AlertCircle para tipo error', () => {
      const { container } = render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Error" 
          message="Ha ocurrido un error"
          type="error"
        />
      );
      
      const iconWrapper = container.querySelector('.modal__icon-wrapper--error');
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe('Modal tipo "info"', () => {
    it('aplica clase de botón primary en tipo info', () => {
      render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Información" 
          message="Información importante"
          type="info"
        />
      );
      
      const confirmButton = screen.getByText('Aceptar');
      expect(confirmButton).toHaveClass('modal__btn--primary');
    });

    it('renderiza icono Info para tipo info', () => {
      const { container } = render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Información" 
          message="Información importante"
          type="info"
        />
      );
      
      const iconWrapper = container.querySelector('.modal__icon-wrapper--info');
      expect(iconWrapper).toBeInTheDocument();
    });
  });

  describe('Icono personalizado', () => {
    it('renderiza icono personalizado cuando se proporciona', () => {
      const CustomIcon = () => <svg data-testid="custom-icon">Custom</svg>;
      render(
        <Modal 
          isOpen={true} 
          onClose={vi.fn()} 
          title="Test" 
          message="Mensaje"
          icon={<CustomIcon />}
        />
      );
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Clases CSS', () => {
    it('aplica clase modal__overlay al overlay', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test" message="Mensaje" />
      );
      
      const overlay = container.querySelector('.modal__overlay');
      expect(overlay).toBeInTheDocument();
    });

    it('aplica clase modal al contenedor del modal', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test" message="Mensaje" />
      );
      
      const modal = container.querySelector('.modal');
      expect(modal).toBeInTheDocument();
    });

    it('aplica clase modal__header al header', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test" message="Mensaje" />
      );
      
      const header = container.querySelector('.modal__header');
      expect(header).toBeInTheDocument();
    });

    it('aplica clase modal__content al contenido', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test" message="Mensaje" />
      );
      
      const content = container.querySelector('.modal__content');
      expect(content).toBeInTheDocument();
    });

    it('aplica clase modal__actions a los botones', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test" message="Mensaje" />
      );
      
      const actions = container.querySelector('.modal__actions');
      expect(actions).toBeInTheDocument();
    });
  });

  describe('Comportamiento de eventos', () => {
    it('detiene la propagación del evento click en el modal', () => {
      const mockOnClose = vi.fn();
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test" message="Mensaje" />
      );
      
      const modal = container.querySelector('.modal');
      const stopPropagationSpy = vi.fn();
      
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      event.stopPropagation = stopPropagationSpy;
      
      modal.dispatchEvent(event);
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('cierra el modal solo cuando el click es directamente en el overlay', () => {
      const mockOnClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test" message="Mensaje" />
      );

      const message = screen.getByText('Mensaje');
      fireEvent.click(message);
      expect(mockOnClose).not.toHaveBeenCalled();
      
      // Click en el overlay sí debe cerrar
      const overlay = message.closest('.modal__overlay');
      fireEvent.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Tipo por defecto', () => {
    it('usa tipo "alert" como valor por defecto', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test" message="Mensaje" />
      );
      
 
      expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
      

      const confirmButton = screen.getByText('Aceptar');
      expect(confirmButton).toHaveClass('modal__btn--primary');
    });
  });
});
