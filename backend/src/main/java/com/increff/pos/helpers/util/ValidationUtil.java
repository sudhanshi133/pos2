package com.increff.pos.helpers.util;

import com.increff.pos.helpers.exception.ApiException;
import com.increff.pos.helpers.exception.ErrorDataList;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class ValidationUtil {
    private static final Logger logger = LoggerFactory.getLogger(ValidationUtil.class);

    public static <T> void validate(T obj) throws ApiException {
        logger.debug("Starting bean validation for object: {}", obj.getClass().getSimpleName());
        
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<T>> violations = validator.validate(obj);
        
        if (violations.isEmpty()) {
            logger.debug("Bean validation passed - no violations found");
            return;
        }

        logger.error("Bean validation failed with {} violations", violations.size());
        List<ErrorDataList> errorList = new ArrayList<>(violations.size());
        for (ConstraintViolation<T> violation : violations) {
            ErrorDataList error = new ErrorDataList();
            error.setCode("");
            error.setField(violation.getPropertyPath().toString());
            error.setMessage(violation.getMessage());
            errorList.add(error);
            logger.error("Validation violation - Field: {}, Message: {}", 
                violation.getPropertyPath(), violation.getMessage());
        }
        throw new ApiException("Validation failed", errorList);
    }
}









