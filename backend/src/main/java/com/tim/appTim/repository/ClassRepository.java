package com.tim.appTim.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.appTim.entity.Class;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {
    Optional<Class> findById(Long id);
}